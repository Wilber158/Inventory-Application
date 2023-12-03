const { app, BrowserWindow } = require('electron')
const db = require('../backend/database.js');


const createWindow = () => {
  const win = new BrowserWindow({
    width: 1024, // set the initial width
    height: 768, // set the initial height
    minWidth: 1024, // set the minimum width
    minHeight: 768, // set the minimum height
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('src/addEntry.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})