const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  hideWindow: (ms) => ipcRenderer.invoke('hide-window', ms),
  showWindow: () => ipcRenderer.invoke('show-window'),
  setOpacity: (val) => ipcRenderer.invoke('set-opacity', val),
  setAutoHide: (enabled, count) => ipcRenderer.invoke('set-auto-hide', { enabled, count }),
  getAutoHide: () => ipcRenderer.invoke('get-auto-hide'),
});
