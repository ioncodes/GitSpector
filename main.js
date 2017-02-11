const {app, BrowserWindow, Tray, Menu} = require('electron')
const path = require('path')
const url = require('url')

let win
let tray = null

function createWindow () {
    tray = new Tray(__dirname + '/icons/icon.ico')
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Exit', click () {
            app.quit();
        }}
    ])
    tray.setToolTip('Open GitSpector')
    tray.setContextMenu(contextMenu)

    win = new BrowserWindow({width: 350, height: 639, resizable: true, maximizable: false, fullscreenable: false, title: 'GitSpector', icon: __dirname + '/icons/icon.ico'})

    win.loadURL(url.format({
        pathname: path.join(__dirname, '/src/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.on('minimize',function(event){
        event.preventDefault()
        win.hide();
    });

    win.on('closed', () => {
        win = null
    })

    win.on('close', (event) => {
      if( !app.isQuiting){
          event.preventDefault()
          win.hide()
      }
      return false;
    })

    tray.on('double-click', () => {
        win.show();
        win.focus();
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
