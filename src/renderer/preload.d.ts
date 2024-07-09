import { ElectronHandler } from '../main/preload';

declare let window: Window;

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    process: any;
    require: any;
    pyRenderer: {
      getGenLocalModels(): any;
      getPrompts(): any;
      queryLocalLLMContext(args: any): any;
      removeAllListeners(): any;
    };
  }
}
export {};
