/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-extension-installer';
import { createLogger, format, transports } from 'winston';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { queryLocalLLMContext } from '../../llmware-wrapper/local-llm-query-prompt-context';
import { queryLocalLLMNoContext } from '../../llmware-wrapper/local-llm-query-prompt-no-context';
import { listAllPrompts, listGenLocalModels } from '../../llmware-wrapper';
import {
  getWorkItems,
  insertWorkItem,
} from './database-service/database.service';

const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [new transports.Console()],
});

class AppUpdater {
  constructor() {
    logger.level = 'info';
    autoUpdater.logger = logger;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

const asyncCallWithTimeout = async (
  asyncPromise: Promise<any>,
  timeLimit: number,
) => {
  let timeoutHandle: any;

  const timeoutPromise = new Promise((_resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(new Error('Async call timeout limit reached')),
      timeLimit,
    );
  });

  return Promise.race([asyncPromise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle);
    return result;
  });
};

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  logger.info(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.handle('get-prompts', async (event, arg) => {
  let response = null;
  try {
    response = await asyncCallWithTimeout(listAllPrompts(), 600000);
    return response;
  } catch (error: any) {
    logger.error(`get-prompts ${new Error(error)}`);
  }
  return response;
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.handle('get-gen-local-models', async (event, arg) => {
  let response = null;
  try {
    response = await asyncCallWithTimeout(listGenLocalModels(), 1200000);
    return response;
  } catch (error: any) {
    logger.error(`get-gen-local-models ${new Error(error)}`);
  }
  return response;
});
ipcMain.handle('query-local-llm-context', async (event, args) => {
  let response: any[] = [];
  try {
    response = await asyncCallWithTimeout(queryLocalLLMContext(args), 1200000);
    return response;
  } catch (error: any) {
    logger.error(`query-local-llm-context ${new Error(error)}`);
  }
  return response;
});
ipcMain.handle('query-local-llm-no-context', async (event, args) => {
  let response: any[] = [];
  try {
    response = await asyncCallWithTimeout(
      queryLocalLLMNoContext(args),
      1200000,
    );
    return response;
  } catch (error: any) {
    logger.error(`query-local-llm-no-context ${new Error(error)}`);
  }
  return response;
});
ipcMain.handle('save-work-item', async (event, args) => {
  try {
    insertWorkItem(args);
  } catch (error: any) {
    logger.error(`save-work-item' ${new Error(error)}`);
  }
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.handle('get-work-items', async (event, args) => {
  try {
    return getWorkItems();
  } catch (error: any) {
    logger.error(`get-work-items' ${new Error(error)}`);
  }
});
ipcMain.handle('send-log-to-main', async (event, args) => {
  try {
    switch (args[1]) {
      case 'error':
        logger.error(args[0]);
        break;
      case 'info':
        logger.info(args[0]);
        break;
      default:
        logger.info(args[0]);
    }
  } catch (error: any) {
    logger.error(`send-log-to-main ${new Error(error)}`);
  }
});

ipcMain.removeAllListeners('query-local-llm-context');

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

const createWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    if (isDebug) {
      await installExtension(REACT_DEVELOPER_TOOLS, {
        loadExtensionOptions: {
          allowFileAccess: true,
        },
      });
    }
    await createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
