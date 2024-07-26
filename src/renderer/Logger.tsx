const logger = (args: any) => {
  window.electron.ipcRenderer.sendLogToMain(args).catch(console.log);
};
export default logger;
