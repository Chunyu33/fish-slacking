const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, screen } = require('electron');
const path = require('path');
const { setMainWindow, hideWindow, showWindow, setOpacity, setFishMode } = require('./main/windowControl');

// 环境变量判断
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let tray;
let hideTimeout;
let isDev = process.env.NODE_ENV === 'development';
let fishMode = false; // 默认不开启摸鱼模式

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

  // 加载页面
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // 开启开发者工具
  if (isDev) mainWindow.webContents.openDevTools();

  setMainWindow(mainWindow); // 设置主窗口，启用窗口控制

  mainWindow.on('show', () => {
    if (hideTimeout) clearTimeout(hideTimeout);
  });
};

// 系统托盘菜单
const createTray = () => {
  const iconPath = path.join(__dirname, 'assets', 'app.ico');
  tray = new Tray(nativeImage.createFromPath(iconPath));

  const contextMenu = Menu.buildFromTemplate([
    { label: '显示窗口', click: () => showWindow() },
    { label: '隐藏窗口', click: () => hideWindow(0) },
    { type: 'separator' },
    { label: '退出', click: () => app.quit() },
  ]);

  tray.setToolTip('Fish Stealth');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => (mainWindow.isVisible() ? hideWindow(0) : showWindow()));
};

// IPC 处理
ipcMain.handle('hide-window', (_, ms = 500) => hideWindow(ms));
ipcMain.handle('show-window', () => showWindow());
ipcMain.handle('minimize-window', () => mainWindow?.minimize());
ipcMain.handle('close-window', () => mainWindow?.close());
ipcMain.handle('set-opacity', (_, val) => setOpacity(val));
ipcMain.handle('set-fish-mode', (_, enabled) => setFishMode(enabled));
ipcMain.handle('set-zoom', (_, val) => {
  if (mainWindow) {
    mainWindow.webContents.setZoomFactor(val); // 设置网页的缩放级别
  }
});


// 应用生命周期
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
