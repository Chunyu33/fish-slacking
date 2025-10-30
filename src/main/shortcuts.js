const { globalShortcut } = require('electron');
const windowControl = require('./windowControl');

function registerShortcuts() {
  globalShortcut.register('Alt+F', () => {
    if (windowControl.getAutoHideState()) {
      windowControl.showWindow(100);
    } else {
      windowControl.hideImmediately();
      windowControl.clearAllTimer();
    }
  });
}

function unregisterShortcuts() {
  globalShortcut.unregisterAll();
}

module.exports = { registerShortcuts, unregisterShortcuts };
