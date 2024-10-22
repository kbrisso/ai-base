// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    async sendLogToMain(args: any) {
      return ipcRenderer.invoke('send-log-to-main', args);
    },
  },
  pyRenderer: {
    async getPrompts() {
      return ipcRenderer.invoke('get-prompts');
    },
    async getGenLocalModels() {
      return ipcRenderer.invoke('get-gen-local-models');
    },
    async queryLocalLLMContext(args: any) {
      return ipcRenderer.invoke('query-local-llm-context', args);
    },
    async queryLocalLLMNoContext(args: any) {
      return ipcRenderer.invoke('query-local-llm-no-context', args);
    },
    async insertWorkItem(args: any) {
      return ipcRenderer.invoke('save-work-item', args);
    },
    async getWorkItems(args: any) {
      return ipcRenderer.invoke('get-work-items', args);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
