const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// limited Electron functionality
contextBridge.exposeInMainWorld('electronAPI', {
  // App Info
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),

  // Dialog APIs
  showMessageBox: (options) => ipcRenderer.invoke('dialog:showMessageBox', options),
  showOpenDialog: (options) => ipcRenderer.invoke('dialog:showOpenDialog', options),
  showSaveDialog: (options) => ipcRenderer.invoke('dialog:showSaveDialog', options),

  // File System (limited for security)
  readFile: async (filePath) => {
    // In production, you'd add validation here
    const fs = require('fs');
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  },

  // Platform detection
  platform: process.platform,

  // Environment
  isDev: process.env.NODE_ENV === 'development',

  // App Events
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
});