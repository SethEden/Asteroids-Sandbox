const fs = require('fs');
const path = require('path');
// import fs from 'fs';
// import path from 'path';

// Generate a unique log file name with a formatted timestamp
function getFormattedTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  return `${year}${month}${day}_${hours}${minutes}${seconds}${milliseconds}`;
}

const logFilePath = path.join(nw.App.dataPath, `app-${getFormattedTimestamp()}.log`);

function logToFile(message) {
  fs.appendFileSync(logFilePath, `${new Date().toISOString()} - ${message}\n`);
}

logToFile('main: Starting main.js');

logToFile('main: YO YO word up!!, World world!');
document.addEventListener('DOMContentLoaded', async () => {
  logToFile('main: Hello, World!');

  try {
    // Dynamically import the nw module
    // const nw = await import('nw');
    // logToFile('We got the NW dynamically!!!');
    // nw.Window.get().maximize();
    logToFile('main: Importing warden module');
    const warden = await import('./warden.mjs');
    logToFile('main: Warden module imported successfully');
    logToFile('main: logFilePath is: ' + logFilePath);
    warden.initialize(logFilePath);
    logToFile('main: Warden module initialized');
  } catch (error) {
    logToFile(`main: Error importing warden module: ${error.message}`);
  }
});
logToFile('main: Hello, World world!');