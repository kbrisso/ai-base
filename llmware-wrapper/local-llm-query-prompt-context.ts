import { Options, PythonShell } from 'python-shell';
import propertiesReader from 'properties-reader';
import path from 'path';
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [new transports.Console()],
});

const LOCAL_LLM_QUERY_PROMPT_CONTEXT =
  'llmware-wrapper/local-llm-query-prompt-context.py';
const properties = propertiesReader(
  path.resolve(__dirname, './llmware-wrapper.properties'),
);
const pythonPath =
  properties.get('pythonpath') != null
    ? (properties.get('pythonpath') as string)
    : '';
async function queryLocalLLMContext(args: Array<string>): Promise<any> {
  if (!pythonPath.length) {
    throw new Error('Python path is not defined');
  }
  const argOptions: Options = {
    mode: 'text',
    pythonPath,
    args,
  };
  const out: any = [];
  try {
    const shell = new PythonShell(LOCAL_LLM_QUERY_PROMPT_CONTEXT, argOptions);
    const pythonKiller = setTimeout(() => {
      shell.childProcess.kill();
    }, 1200000);

    return await new Promise((resolve, reject) => {
      shell.end((error) => {
        clearTimeout(pythonKiller);
        if (error) {
          logger.error(`queryLocalLLMContext ${error}`);
          reject(error);
        } else {
          resolve(out);
        }
      });
      shell.on('message', (message) => {
        out.push(message);
      });
      shell.on('error', (error) => {
        logger.error(`queryLocalLLMContext ${error}`);
        reject(error);
      });
    });
  } catch (error) {
    logger.error(`queryLocalLLMContext ${error}`);
    return error;
  }
}
// eslint-disable-next-line import/prefer-default-export
export { queryLocalLLMContext };
