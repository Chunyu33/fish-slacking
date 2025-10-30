const { ipcMain } = require('electron');
const store = require('./store');
const windowControl = require('./windowControl');

function registerIpcHandlers() {
  // 获取自动隐藏状态
  ipcMain.handle('get-auto-hide', () => windowControl.getAutoHideState());

  // 设置自动隐藏
  ipcMain.handle('set-auto-hide', (_, args) => {
    const { enabled, count } = args || {};
    store.set('autoHide', enabled);
    windowControl.setAutoHide(enabled, count);
  });

  // 设置透明度
  ipcMain.handle('set-opacity', (_, val) => {
    store.set('opacity', val);
    windowControl.setOpacity(val);
  });

  // 设置缩放
  ipcMain.handle('set-zoom', (_, val) => {
    store.set('scale', val);
    windowControl.setZoom(val);
  });

  // 窗口控制
  ipcMain.handle('show-window', () => windowControl.showWindow());
  ipcMain.handle('hide-window', (_, ms) => windowControl.hideWindow(ms));
  ipcMain.handle('hide-immediately', () => windowControl.hideImmediately());
}

module.exports = { registerIpcHandlers };
