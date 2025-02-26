// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onSetDisplayId: (callback) => ipcRenderer.on('set-display-id', callback),
});