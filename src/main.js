const { app, BrowserWindow, ipcMain} = require('electron')
const db = require('../backend/database.js');
const csvParsing = require('../backend/csv_parsing.js');
const userEntries = require('../backend/userEntries.js');
const userPartEntries = require('../backend/userPartEntries.js');
const path = require('path');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1024, // set the initial width
    height: 768, // set the initial height
    minWidth: 1024, // set the minimum width
    minHeight: 768, // set the minimum height
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
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

ipcMain.on('submit_Add_Entry', async (event, formData) => {
  try {
      console.log("calling createUserInventoryEntry...")
      console.log(formData);
      const result = await userEntries.createUserInventoryEntry(formData.prefix, formData.partNumber, formData.quantity, formData.warehouse, formData.zone, formData.seller, formData.manufacturer, formData.condition, formData.unitCost, formData.notes, null, formData.type);
      event.reply('submit_Add_Entry_Response', result);
            
  } catch (error) {
      // Handle the error
      console.error('Error in submit_Add_Entry:', error);
      event.reply('submit_Add_Entry_Response', { error: error.message });
  }
});

ipcMain.on('get_Inventory_Entries', async (event, formData) => {
  try{
    console.log("calling getInventoryEntries...");
    console.log(formData);
    const result = await userEntries.getInventoryEntry(formData);
  }catch(error){
    console.error('Error in get_Inventory_Entries:', error);
    event.reply('get_Inventory_Entries_Response', { error: error.message });
  }
});
