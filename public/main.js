const {app, BrowserWindow} = require('electron')

function createWindow() {
    //Create browser window
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {}
    })

    win.loadURL('http://localhost:3000')
}


app.on('ready', createWindow)
