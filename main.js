const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
// const WaveSurfer = require('wavesurfer.js')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 1200,
    backgroundColor: "#eeeeee",
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"))

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then( () => {
  createWindow()

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// modules to send
ipcMain.on('windowControls:maximize', (ipcEvent) => {
  const window = findBrowserWindow(ipcEvent)
  if ( window.isMaximized() ) window.restore()
  else window.maximize()
})

ipcMain.on('windowControls:minimize', (ipcEvent) => {
  const window = findBrowserWindow(ipcEvent)
  window.minimize()
})

ipcMain.on('windowControls:close', (ipcEvent) => {
  const window = findBrowserWindow(ipcEvent)
  window.close()
})

// ipcEvent.sender is the webContents that sent the message
// use BrowserWindow.fromWebContents to get the associated BrowserWindow instance
function findBrowserWindow(ipcEvent) {
  return BrowserWindow.fromWebContents(ipcEvent.sender)
}

ipcMain.on('trackLoaded', (event, data) => {
  // const waveform = WaveSurfer.create({
  //   container: data,
  //   waveColor: '#aaa',
  //   progressColor: '#eee',
  //   height: 50,
  //   barWidth: 2,
  //   barRadius: 1,
  //   partialRender: true
  // })

  // event.reply('waveReady', WaveSurfer)
})