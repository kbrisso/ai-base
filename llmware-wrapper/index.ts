import { PythonShell, Options } from 'python-shell';
import path from 'path';
import propertiesReader from 'properties-reader';

const properties = propertiesReader(
  path.resolve(__dirname, './llmware-wrapper.properties'),
);
const pythonPath = properties.get('pythonpath');

const options: Options = {
  mode: 'text',
  pythonPath,
  pythonOptions: ['-u'],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function listGenLocalModels(): Promise<string | undefined> {
  try {
    let messages: any;
    messages = await PythonShell.run(
      'llmware-wrapper/list-gen-local-models.py',
      options,
    );
    return messages as string;
  } catch (error) {
    console.error(error);
    return '';
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function listAllPrompts(): Promise<string | undefined> {
  try {
    let prompts: any;
    prompts = await PythonShell.run(
      'llmware-wrapper/list-all-prompts.py',
      options,
    );
    return prompts as string;
  } catch (error) {
    console.error(error);
    return '';
  }
}

export { listAllPrompts, listGenLocalModels };
