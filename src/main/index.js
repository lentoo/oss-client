// import { app, BrowserWindow } from 'electron'
const { app, BrowserWindow } = require('electron')

// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true
        },
    })

    win.loadURL('http://localhost:3001')
}

app.whenReady()
    .then(() => {
        createWindow()
    })
