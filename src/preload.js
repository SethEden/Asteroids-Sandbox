// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onSetDisplayInfo: (callback) => ipcRenderer.on('set-display-info', callback),
  getSharedState: () => ipcRenderer.invoke('get-shared-state'),
  setSharedState: (newState) => ipcRenderer.invoke('set-shared-state', newState),
  on: (channel, listener) => ipcRenderer.on(channel, listener),
});

console.log('Preload script loaded');