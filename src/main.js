const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, screen } = require('electron');
const path = require('node:path');
const {
  setMainWindow,
  showWindow,
  hideWindow,
  setAutoHide,
  getAutoHideState,
  setOpacity,
  hideImmediately,
} = require('./main/windowControl');

if (require('electron-squirrel-startup')) app.quit();

let mainWindow;
let tray;
let isDev = process.env.NODE_ENV === 'development';

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    x: width - 820,
    y: height - 620,
    frame: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  if (isDev) mainWindow.webContents.openDevTools();

  setMainWindow(mainWindow);
};

const createTray = () => {
  const iconPath = path.join(__dirname, 'assets', 'fish.png');
  const trayIcon = nativeImage.createFromPath(iconPath);
  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    { label: '显示窗口', click: () => showWindow() },
    { label: '隐藏窗口', click: () => hideWindow() },
    { type: 'separator' },
    { label: '退出', click: () => app.quit() },
  ]);

  tray.setToolTip('Fish Stealth');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => (mainWindow.isVisible() ? hideWindow() : showWindow()));
};

// IPC
ipcMain.handle('hide-window', (_, ms) => hideWindow(ms));
ipcMain.handle('show-window', () => showWindow());
ipcMain.handle('minimize-window', () => mainWindow?.minimize());
ipcMain.handle('close-window', () => mainWindow?.close());
ipcMain.handle('set-opacity', (_, val) => setOpacity(val));
ipcMain.handle('set-auto-hide', (_, enabled) => setAutoHide(enabled));
ipcMain.handle('get-auto-hide', () => getAutoHideState());

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
