const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron', {
    send: (channel, data) => {
      // whitelist channels
      const validChannels = ['app-ready', 'file-operation'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      const validChannels = ['file-operation-result'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    // Expose any environment variables or platform info needed by the renderer
    platform: process.platform,
    isElectron: true
  }
);

// Notify main process that preload script has loaded
window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('app-ready');
});