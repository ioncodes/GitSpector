const {app, BrowserWindow, Tray, Menu} = require('electron')
const path = require('path')
const url = require('url')

let win
let tray = null
var isInTray = false;

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
    if (win) {
        if (win.isMinimized() || isInTray) {
            win.show()
            win.focus()
        }
    }
})

if (shouldQuit) {
    app.quit()
}

function createWindow () {
    tray = new Tray(__dirname + '/icons/icon.ico')
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Exit', click () {
            app.quit()
        }}
    ])
    tray.setToolTip('Open GitSpector')
    tray.setContextMenu(contextMenu)

    win = new BrowserWindow({width: 350, height: 639, resizable: false, maximizable: false, fullscreenable: false, title: 'GitSpector', icon: __dirname + '/icons/icon.ico'})
    win.setMenu(null)

    win.loadURL(url.format({
        pathname: path.join(__dirname, '/src/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.on('minimize',function(event){
        event.preventDefault()
        win.hide()
        isInTray = true
    });

    win.on('closed', () => {
        win = null
    })

    win.on('close', (event) => {
      if( !app.isQuiting){
          event.preventDefault()
          win.hide()
          isInTray = true
      }
      return false;
    })

    tray.on('double-click', () => {
        win.show()
        win.focus()
        isInTray = false
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})
