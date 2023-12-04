const { app, BrowserWindow, ipcMain, ipcRenderer, dialog} = require('electron')
const db = require('../backend/database.js');
const csvParsing = require('../backend/csv_parsing.js');
const userEntries = require('../backend/userEntries.js');
const userLocations = require('../backend/userLocations.js');
const userPartEntries = require('../backend/userPartEntries.js');
const path = require('path');
const fs = require('fs');


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
      console.log("result of createUserInventoryEntry: ", result);
      event.reply('submit_Add_Entry_Response', result);
            
  } catch (error) {
      // Handle the error
      console.error('Error in submit_Add_Entry:', error);
      event.reply('submit_Add_Entry_Response', { error: error.message });
  }
});

ipcMain.on('open-directory-dialog', (event) => {
  dialog.showOpenDialog({
      properties: ['openDirectory']
  }).then(result => {
      if (!result.canceled) {
          event.sender.send('selected-directory', result.filePaths);
      }
  }).catch(err => {
      console.log(err);
  });
});

ipcMain.handle('copy_file', async (event, destination) => {
  try {
      const source = path.join(__dirname, '../backend/inventory.db')
      await fs.promises.copyFile(source, destination);
      return 'File copied successfully';
  } catch (error) {
      console.error('Failed to copy file:', error);
      return 'Error copying file';
  }
});


ipcMain.on('get_Inventory_Entries', async (event, formData) => {
  try{
    console.log("calling getInventoryEntries...");
    console.log(formData);
    const result = await userEntries.getInventoryEntry(formData);

    console.log("result of getInventoryEntries: ", result);

    event.reply('get_Inventory_Entries_Response', result);
  }catch(error){
    console.error('Error in get_Inventory_Entries:', error);
    event.reply('get_Inventory_Entries_Response', { error: error.message });
  }
});

//get_CSV_Data: (filePath) => ipcRenderer.send('get_CSV_Data', filePath),
//get_CSV_Data_Response: (callback) => ipcRenderer.on('get_CSV_Data_Response', callback),

ipcMain.on('get_CSV_Data', async (event, filePath) => {
  try{
    console.log("calling getCSVData...");
    console.log(filePath);
    const result = await csvParsing.getCSVData(filePath);

    console.log("result of getCSVData: ", result);

    event.reply('get_CSV_Data_Response', result);
  }catch(error){
    console.error('Error in get_CSV_Data:', error);
    event.reply('get_CSV_Data_Response', { error: error.message });
  }
});

ipcMain.on('get_locations', async (event, formData) => {
  try{
    console.log("calling getLocations...");
    console.log(formData);
    const result = await userLocations.getLocationRows(formData);

    console.log("result of getLocations: ", result);

    event.reply('get_locations_Response', result);
  }catch(error){
    console.error('Error in get_locations:', error);
    event.reply('get_locations_Response', { error: error.message });
  }
});

