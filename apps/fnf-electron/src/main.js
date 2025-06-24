const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const serve = require('electron-serve');
const { spawn } = require('child_process');

// Determine if we're in development or production
const isDev = !app.isPackaged;

// In production, serve the built Angular app
const loadURL = serve({ directory: path.join(__dirname, '../../fnf/dist/fnf') });


// Use child_process to spawn backend
// spawn('node', ['../fnf-api/dist/main.js'], { stdio: 'inherit' });


// Keep a global reference of the window object to prevent garbage collection
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false, // For security reasons
      contextIsolation: true, // Protect against prototype pollution
      preload: path.join(__dirname, 'preload.js') // Use a preload script
    }
  });

  // Load the app
  if (isDev) {
    //mainWindow.loadFile(path.join(__dirname, '../fnf/dist/fnf/index.html'));
    // In development, load from Angular dev server
    mainWindow.loadURL('http://localhost:4200');
    // Open DevTools
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built app
    loadURL(mainWindow);
  }

  // Handle window being closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create window when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// On macOS, recreate window when dock icon is clicked and no windows are open
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle IPC messages from renderer process
ipcMain.on('app-ready', (event) => {
  console.log('App is ready');
});