// import { app, BrowserWindow } from 'electron'
const { app, BrowserWindow, ipcMain, session, dialog } = require("electron");

const IS_PROD = process.env.NODE_ENV === "production";
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
console.log("NODE_ENV", process.env.NODE_ENV);
let win;

let saveFilePath = "";
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: true,
      contextIsolation: false,
    },
  });
  if (IS_PROD) {
    win.loadFile(`./dist/index.html`);
  } else {
    win.loadURL("http://localhost:3001");
    win.webContents.openDevTools();
  }

  ipcMain.on("download-file", (event, url) => {
    console.log("download-file", url);
    // win.webContents.downloadURL(url);
    saveFilePath = dialog.showSaveDialogSync(win, {
      title: "选择保存路径",
      properties: ["openDirectory", "createDirectory"],
    });
    saveFilePath && win.webContents.downloadURL(url);
  });
  session.defaultSession.on("will-download", (event, item, webContents) => {
    console.log("will-load");
    console.log(item);
    saveFilePath && item.setSavePath(saveFilePath);
    item.on("updated", () => {
      const bytes = item.getReceivedBytes();
      console.log(bytes);
    });
  });
}

app
  .whenReady()
  .then(() => {
    createWindow();
  })
  .then(() => {
    app.on("download-file", (event, url) => {
      console.log("download-file", url);
      win.webContents.downloadURL(url);
    });
  });
