const { screen } = require('electron');

let mainWindow = null;
let autoHideEnabled = true;
let isWindowVisible = true;
let checkTimer = null;
let startupTimer = null;
let lastCursorInside = true;

// 设置主窗口引用
function setMainWindow(win) {
  mainWindow = win;
}

// 设置自动隐藏开关
function setAutoHide(enabled) {
  autoHideEnabled = enabled;
  if (!enabled) {
    clearInterval(checkTimer);
    clearTimeout(startupTimer);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
      isWindowVisible = true;
    }
  } else {
    initAutoHideWatcher(); // 重新启动检测逻辑
  }
}

function getAutoHideState() {
  return autoHideEnabled;
}

// 显示窗口
function showWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.showInactive(); // 不抢焦点
    isWindowVisible = true;

    // 重新启动5秒定时器
    if (autoHideEnabled) {
      clearTimeout(startupTimer);
      startupTimer = setTimeout(() => {
        console.log('⏳ 启动5秒后开始监控鼠标状态');
        startMouseWatcher();
      }, 5000);
    }
  }
}

// 隐藏窗口
function hideWindow(ms = 0) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    setTimeout(() => {
      mainWindow.hide();
      isWindowVisible = false;
    }, ms);
  }
}

// 立即隐藏（备用）
function hideImmediately() {
  hideWindow(0);
}

// 设置透明度
function setOpacity(val) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setOpacity(val);
  }
}

// -----------------------------
// ✅ 核心逻辑部分
// -----------------------------
function startMouseWatcher() {
  clearInterval(checkTimer);

  checkTimer = setInterval(() => {
    if (!mainWindow || !autoHideEnabled) return;

    const cursor = screen.getCursorScreenPoint();
    const bounds = mainWindow.getBounds();

    const isInside =
      cursor.x >= bounds.x &&
      cursor.x <= bounds.x + bounds.width &&
      cursor.y >= bounds.y &&
      cursor.y <= bounds.y + bounds.height;

    if (isInside && !lastCursorInside) {
      lastCursorInside = true;
      if (!isWindowVisible) {
        mainWindow.showInactive();
        isWindowVisible = true;
        console.log("🟢 in -> show");
      }
    } else if (!isInside && lastCursorInside) {
      lastCursorInside = false;
      if (isWindowVisible) {
        mainWindow.hide();
        isWindowVisible = false;
        console.log("🔴 leave -> hide");
      }
    }
  }, 200);
}

function initAutoHideWatcher() {
  clearInterval(checkTimer);
  clearTimeout(startupTimer);

  if (!autoHideEnabled) return;

  // 应用启动后5秒才启用检测
  startupTimer = setTimeout(() => {
    console.log('🚀 启动后5秒，开启鼠标检测');
    startMouseWatcher();
  }, 5000);
}

module.exports = {
  setMainWindow,
  showWindow,
  hideWindow,
  setAutoHide,
  getAutoHideState,
  setOpacity,
  hideImmediately,
  initAutoHideWatcher,
};
