const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  hideWindow: (ms) => ipcRenderer.invoke('hide-window', ms),
  showWindow: () => ipcRenderer.invoke('show-window'),
  setOpacity: (val) => ipcRenderer.invoke('set-opacity', val),
  setZoom: (val) => ipcRenderer.invoke('set-zoom', val),
});
