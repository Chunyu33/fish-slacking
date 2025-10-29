let mainWindow = null;
let autoHideEnabled = true;
let hideTimer = null;

let mouseInside = true;

function setMainWindow(win) {
  mainWindow = win;

  mainWindow.on('show', () => {
    mouseInside = true;
    clearHideTimer();
    if (autoHideEnabled) startHideTimer(5000); // 刚打开延迟 5s
  });

  mainWindow.on('focus', () => {
    mouseInside = true;
    clearHideTimer();
  });

  mainWindow.on('blur', () => {
    mouseInside = false;
    if (autoHideEnabled) hideImmediately();
  });
}

// 启动延迟隐藏
function startHideTimer(ms = 5000) {
  clearHideTimer();
  hideTimer = setTimeout(() => {
    if (!mouseInside && autoHideEnabled) mainWindow?.hide();
  }, ms);
}

// 立即隐藏
function hideImmediately() {
  clearHideTimer();
  if (autoHideEnabled) mainWindow?.hide();
}

// 暂停隐藏定时器
function pauseHideTimer() {
  clearHideTimer();
}

// 恢复隐藏定时器
function resumeHideTimer(ms = 5000) {
  if (autoHideEnabled) startHideTimer(ms);
}

function clearHideTimer() {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

function showWindow() {
  mainWindow?.show();
  mouseInside = true;
  if (autoHideEnabled) startHideTimer(5000);
}

function hideWindow(ms = 0) {
  if (!autoHideEnabled) return;
  if (ms <= 0) hideImmediately();
  else startHideTimer(ms);
}

function setAutoHide(enabled) {
  autoHideEnabled = enabled;
  if (!enabled) clearHideTimer();
}

function getAutoHideState() {
  return autoHideEnabled;
}

function setOpacity(val = 1) {
  mainWindow?.setOpacity(val);
}

module.exports = {
  setMainWindow,
  showWindow,
  hideWindow,
  startHideTimer,
  pauseHideTimer,
  resumeHideTimer,
  setAutoHide,
  getAutoHideState,
  hideImmediately,
  setOpacity,
};
