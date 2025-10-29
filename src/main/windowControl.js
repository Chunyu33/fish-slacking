let mainWindow = null;
let hideTimeout = null;
let fishMode = false;

function setMainWindow(win) {
  mainWindow = win;

  mainWindow.on('blur', () => {
    if (fishMode) {
      if (hideTimeout) clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => mainWindow.hide(), 500);
    }
  });

  mainWindow.on('show', () => {
    if (hideTimeout) clearTimeout(hideTimeout);
  });
}

function setFishMode(enabled) {
  fishMode = enabled;
}

function hideWindow(ms = 0) {
  if (!mainWindow) return;
  if (hideTimeout) clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => mainWindow.hide(), ms);
}

function showWindow() {
  if (!mainWindow) return;
  mainWindow.show();
}

function setOpacity(val = 1) {
  if (!mainWindow) return;
  mainWindow.setOpacity(val);
}

module.exports = {
  setMainWindow,
  hideWindow,
  showWindow,
  setOpacity,
  setFishMode,
};
