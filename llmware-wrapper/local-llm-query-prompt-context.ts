import { Options, PythonShell } from 'python-shell';
import propertiesReader from 'properties-reader';
import path from 'path';

const properties = propertiesReader(
  path.resolve(__dirname, './llmware-wrapper.properties'),
);
const pythonPath = properties.get('pythonpath');
async function queryLocalLLMContext(
  args: Array<string>,
): Promise<string | undefined> {
  const argOptions: Options = {
    mode: 'text',
    pythonPath,
    args,
  };
  const out = [];
  try {
    const shell = new PythonShell(
      'llmware-wrapper/local-llm-query-prompt-context.py',
      argOptions,
    );
    const pythonKiller = setTimeout(function () {
      shell.childProcess.kill();
    }, 600000);

    const retVal = await new Promise((resolve, reject) => {
      shell.end((error) => {
        clearTimeout(pythonKiller);
        if (error) {
          reject(error);
        } else {
          resolve(out);
        }
      });
      shell.on('message', (message) => {
        out.push(message);
      });
      shell.on('error', (error) => {
        reject(error);
      });
    });
    return retVal;
  } catch (error) {
    return '';
  }
}
// eslint-disable-next-line import/prefer-default-export
export { queryLocalLLMContext };
