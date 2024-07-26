import { PythonShell, Options } from 'python-shell';
import path from 'path';
import propertiesReader from 'properties-reader';
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [new transports.Console()],
});
const LIST_ALL_PROMPTS_SCRIPT_PATH = 'llmware-wrapper/list-all-prompts.py';
const LIST_GEN_LOCAL_MODELS_SRIPT_PATH =
  'llmware-wrapper/list-gen-local-models.py';
const properties = propertiesReader(
  path.resolve(__dirname, './llmware-wrapper.properties'),
);
const pythonPath =
  properties.get('pythonpath') != null
    ? (properties.get('pythonpath') as string)
    : '';
const options: Options = {
  mode: 'text',
  pythonPath,
  pythonOptions: ['-u'],
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function listGenLocalModels(): Promise<any> {
  try {
    if (!pythonPath.length) {
      throw new Error('Python path is not defined');
    }
    return await PythonShell.run(LIST_GEN_LOCAL_MODELS_SRIPT_PATH, options);
  } catch (error) {
    logger.error(`index.ts ${error}`);
    return error;
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function listAllPrompts(): Promise<any> {
  try {
    if (!pythonPath.length) {
      throw new Error('Python path is not defined');
    }
    return await await PythonShell.run(LIST_ALL_PROMPTS_SCRIPT_PATH, options);
  } catch (error) {
    logger.error(`index.ts ${error}`);
    return '';
  }
}

export { listAllPrompts, listGenLocalModels };
