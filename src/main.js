const fs = require('fs');
const path = require('path');

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

logToFile('YO YO word up!!, World world!');
document.addEventListener('DOMContentLoaded', () => {
  logToFile('Hello, World!');
  nw.Window.get().maximize();
});
logToFile('Hello, World world!');