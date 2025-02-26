// main.js
import { app, BrowserWindow, screen } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let additionalWindows = [];

function createWindows() {
  const displays = screen.getAllDisplays();
  displays.forEach((display, index) => {
    const win = new BrowserWindow({
      x: display.bounds.x,          // Position at the display's top-left corner
      y: display.bounds.y,
      width: display.bounds.width,  // Match the display's width
      height: display.bounds.height, // Match the display's height
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        affinity: 'main',
      },
    });
    win.loadFile(path.join(__dirname, '../public/index.html'));
    // Designate the first window (on primary display) as mainWindow
    if (index === 0) {
      mainWindow = win;
      mainWindow.webContents.openDevTools(); // Keep for debugging
    } else {
      additionalWindows.push(win);
    }
    // Log position and size for debugging
    win.webContents.on('did-finish-load', () => {
      console.log(`Window ${index} position:`, win.getPosition(), 'size:', win.getSize());
    });
    // Quit the app when any window is closed
    win.on('closed', () => {
      app.quit();
    });
  });
}

app.on('ready', createWindows);

app.on('activate', () => {
  if (!mainWindow) createWindows();
});