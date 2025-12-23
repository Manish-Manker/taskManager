const { app, BrowserWindow, Menu, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Import menu - make sure this path is correct
const { createMenu } = require('./menu');

// Keep a global reference of the window object
let mainWindow;

function createMainWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  // Load app based on environment
  const startURL = isDev 
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../frontend/dist/index.html')}`;

  mainWindow.loadURL(startURL);
  console.log('startURL ',startURL);
  
  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Event listeners
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

// App event handlers
app.whenReady().then(() => {
  createMainWindow();
  createMenu(mainWindow); // Create menu after window is created

  // IPC Handlers
  ipcMain.handle('get-app-info', () => {
    return {
      name: app.getName(),
      version: app.getVersion(),
      platform: process.platform,
      isDev,
    };
  });

  ipcMain.handle('dialog:showMessageBox', (event, options) => {
    return dialog.showMessageBox(mainWindow, options);
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});