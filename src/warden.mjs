// import fs from 'fs';
// import path from 'path';
// import nw from 'nw';
// const fs = require('fs');
// const path = require('path');
let fs;
let path;

async function loadNodeModules() {
  // fs = await import('fs');
  // path = await import('path');
}

const logFilePath = '';
function logToFile(message) {
  fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${message}\n`);
}

export async function initialize(logPath) {
  await loadNodeModules();
  logToFile('warden: logPath is: ' + logPath);
  logFilePath = logPath;
  logToFile('warden: Starting warden.js');
  logToFile('warden: YO YO word up!!, World world!');

  document.addEventListener('DOMContentLoaded', async () => {
    logToFile('warden: Hello, World!');

    try {
      // Dynamically import the nw module
      const nw = await import('nw');
      logToFile('warden: NW module imported successfully');
      nw.Window.get().maximize();
    } catch (error) {
      logToFile(`warden: Error importing NW module: ${error.message}`);
    }
  });

  logToFile('warden: Hello, World world!');
}