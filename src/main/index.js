// import { app, BrowserWindow } from 'electron'
const { app, BrowserWindow } = require("electron");

const IS_PROD = process.env.NODE_ENV === "production";
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
console.log("NODE_ENV", process.env.NODE_ENV);
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: true,
    },
  });
  if (IS_PROD) {
    win.loadFile(`./dist/index.html`);
  } else {
    win.loadURL("http://localhost:3001");
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();
});
