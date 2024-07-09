import { PythonShell } from 'python-shell';
import { listAllModels } from '../index';

jest.mock('python-shell', () => {
  return {
    PythonShell: {
      run: jest.fn().mockImplementation((script, options) => {
        if (script === 'list-all-models.py' && options) {
          return Promise.resolve('Mocked response');
        }
      }),
    },
  };
});

describe('my test', () => {
  it('should mock PythonShell.run', async () => {
    const response = await PythonShell.run('list-all-models.py', {});
    expect(response).toEqual('Mocked response');
  });
});

describe('listAllModels', () => {
  it('returns messages when PythonShell does not throw an error', async () => {
    (PythonShell.run as jest.Mock).mockResolvedValue('testMessage');
    const messages = await listAllModels();
    expect(PythonShell.run).toHaveBeenCalledWith(
      'list-all-models.py',
      expect.any(Object),
    );
    expect(messages).toEqual('testMessage');
  });
});
