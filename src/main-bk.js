const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, screen } = require('electron');
const path = require('node:path');
const { setMainWindow, hideWindow, showWindow } = require('./main/windowControl');

if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let tray;
let isDev = process.env.NODE_ENV === 'development';
let hideTimeout;

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

  // 仅生产环境启用摸鱼模式
  if (!isDev) {
    mainWindow.on('blur', () => {
      if (hideTimeout) clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => mainWindow.hide(), 500);
    });
  }

  mainWindow.on('show', () => {
    if (hideTimeout) clearTimeout(hideTimeout);
  });
};

const createTray = () => {
  const iconPath = path.join(__dirname, 'assets', 'app.ico');
  const trayIcon = nativeImage.createFromPath(iconPath);
  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    { label: '显示窗口', click: () => mainWindow.show() },
    { label: '隐藏窗口', click: () => mainWindow.hide() },
    { type: 'separator' },
    { label: '退出', click: () => app.quit() },
  ]);

  tray.setToolTip('Fish Stealth');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show());
};

// IPC
ipcMain.handle('hide-window', (_, ms = 500) => {
  if (hideTimeout) clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => mainWindow.hide(), ms);
});

ipcMain.handle('show-window', () => mainWindow.show());
ipcMain.handle('minimize-window', () => mainWindow.minimize());
ipcMain.handle('close-window', () => mainWindow.close());

// App 生命周期
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
