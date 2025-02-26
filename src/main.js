// main.js
import { app, BrowserWindow, screen } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let additionalWindows = [];

function createWindows() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      affinity: 'main',
    },
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.webContents.openDevTools(); // Add this for debugging

  // Quit the app when the main window is closed
  mainWindow.on('closed', () => {
    app.quit();
  });

  const displays = screen.getAllDisplays();
  displays.forEach((display, index) => {
    if (index > 0) {
      const win = new BrowserWindow({
        x: display.bounds.x,
        y: display.bounds.y,
        width: display.bounds.width,
        height: display.bounds.height,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          affinity: 'main',
        },
      });
      win.loadFile(path.join(__dirname, 'index.html'));
      // Quit the app when any additional window is closed
      win.on('closed', () => {
        app.quit();
      });
      additionalWindows.push(win);
    }
  });
}

app.on('ready', createWindows);

app.on('activate', () => {
  if (!mainWindow) createWindows();
});