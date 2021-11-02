const {app, BrowserWindow, ipcMain} = require('electron')

const path = require('path')
const fs = require('fs')

require('@electron/remote/main').initialize()

function createWindow() {
    //Create browser window
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: false, //best practice to NOT enable this
            enableRemoteModule: true,
            preload: path.join(__dirname + '/preload.js')
        }
    })

    win.loadURL('http://localhost:3000')
}


app.on('ready', createWindow)

ipcMain.on("toMain", (event, args) => {
    fs.readFile("path/to/file", (error, data) => {
        // Do something with file contents

        // Send result back to renderer process
        win.webContents.send("fromMain", responseObj);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
