const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  executeJS: (code) => ipcRenderer.invoke('execute-js', code)
});