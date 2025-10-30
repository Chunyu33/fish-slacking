const {
  showWindow,
  hideWindow,
  hideImmediately,
  setAutoHide,
  getAutoHideState,
  setOpacity,
  setScale,
  clearAllTimer,
} = require("./windowControl");

function registerIPC(ipcMain) {
  ipcMain.handle("minimize-window", () => hideWindow());
  ipcMain.handle("show-window", () => showWindow());
  ipcMain.handle("hide-window", (_, ms) => hideWindow(ms));
  ipcMain.handle("hide-immediately", () => hideImmediately());
  ipcMain.handle("set-auto-hide", (_, args) => {
    const { enabled, count } = args || {};
    setAutoHide(enabled, count);
  });
  ipcMain.handle("get-auto-hide", () => getAutoHideState());
  ipcMain.handle("set-opacity", (_, val) => setOpacity(val));
  ipcMain.handle("get-opacity", () => require("./store").get("opacity"));
  ipcMain.handle("set-scale", (_, val) => setScale(val));
  ipcMain.handle("get-scale", () => require("./store").get("scale"));
  ipcMain.handle("close-window", (_, args) => {
    if (args?.force) process.exit(0);
    else hideWindow();
    // process.exit(0);
  });
}

module.exports = registerIPC;
