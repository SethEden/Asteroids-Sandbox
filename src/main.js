// main.js
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let additionalWindows = [];
let sharedState = {
    initialized: false,
    displayCount: 0,
    views: []
  };

function createWindows() {
  const displays = screen.getAllDisplays();
  displays.forEach((display, index) => {
    const win = new BrowserWindow({
      x: display.bounds.x,          // Position at the display's top-left corner
      y: display.bounds.y,
      width: display.bounds.width,  // Match the display's width
      height: display.bounds.height, // Match the display's height
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'), // Add this
        affinity: 'main',
      },
    });
    win.loadFile(path.join(__dirname, '../public/index.html'));
    // Designate the first window (on primary display) as mainWindow
    if (index === 0) {
      mainWindow = win;
    }
    mainWindow.webContents.openDevTools(); // Keep for debugging
    additionalWindows.push(win);
    // Log position and size for debugging
    win.webContents.on('did-finish-load', () => {
      win.webContents.send('set-display-info', { index, bounds: display.bounds });
      console.log(`Sent to window ${index}:`, { index, bounds: display.bounds });
      console.log(`Window ${index} position:`, win.getPosition(), 'size:', win.getSize());
    });

    // Quit the app when any window is closed
    win.on('closed', () => {
      app.quit();
    });
  });
}

ipcMain.handle('get-shared-state', () => {
  return sharedState;
});

ipcMain.handle('set-shared-state', (event, newState) => {
  sharedState = { ...sharedState, ...newState };
  additionalWindows.forEach(win => {
    win.webContents.send('shared-state-updated', sharedState);
  });
});

app.on('ready', createWindows);

app.on('activate', () => {
  if (!mainWindow) createWindows();
});