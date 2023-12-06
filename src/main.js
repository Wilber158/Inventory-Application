const { app, BrowserWindow, ipcMain, ipcRenderer, dialog} = require('electron')
const db = require('../backend/database.js');
const csvParsing = require('../backend/csv_parsing.js');
const userEntries = require('../backend/userEntries.js');
const userLocations = require('../backend/userLocations.js');
const userPartEntries = require('../backend/userPartEntries.js');
const path = require('path');
const fs = require('fs');


let backUpInprogress = false;
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



// example function that triggers a dialog
function showSuccessInfoDialog() {
  dialog.showMessageBox({
      type: 'info',
      title: 'Success!',
      message: 'Your Entry Has Been Successfully Added!',
      buttons: ['OK']
  });
}

// example function that triggers a dialog
function showErrorInfoDialog() {
  dialog.showMessageBox({
      type: 'info',
      title: 'ERROR!',
      message: 'Your Entry Has Not Been Added!',
      buttons: ['OK']
  });
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



app.on('before-quit', (event) => {
  if (backUpInprogress) {
      console.log("Backup already in progress...");
      return;
  }

  // prevent the app from quitting immediately
  event.preventDefault();
  backUpInprogress = true;
  
  // perform the backup in an async IIFE (Immediately Invoked Function Expression)
  (async () => {
      try {
          const backupMessage = await backup_Database();
          console.log(backupMessage);
      } catch (error) {
          console.error('Error during backup:', error);
      } finally {
          // pfter backup is complete or fails, quit the app
          app.quit();
      }
  })();
});




//function to copy database onto user selected directory
async function backup_Database() {
  try {
      const userSettingsPath = path.join(__dirname, '../backend/userSettings.json');
      // Read the contents of the user settings file
      const userSettingsData = await fs.promises.readFile(userSettingsPath);
      // Parse the JSON data
      const userSettings = JSON.parse(userSettingsData);

      const destination = userSettings.backupLocation;
      const source = path.join(__dirname, '../backend/inventory.db');
      // Copy the file
      fs.promises.copyFile(source, destination);
      return 'Database backed up successfully';
  } catch (error) {
      console.error('Failed to backup database:', error);
      return `Error copying file: ${error.message}`;
  }
}

//funciton to write user settings to file given the data name
async function write_User_Settings(data, dataname) {
  try {
      const userSettingsPath = path.join(__dirname, '../backend/userSettings.json');
      
      let dataToWrite = {};

      // Check if the file exists
      try {
          const fileContent = await fs.readFile(userSettingsPath);
          dataToWrite = JSON.parse(fileContent);
      } catch (readError) {
          // If the file doesn't exist, start with an empty object
          console.log('File does not exist, creating new one');
      }

      // Update the data
      dataToWrite[dataname] = data;

      // Write the updated data to the file
      await fs.promises.writeFile(userSettingsPath, JSON.stringify(dataToWrite));
      return 'Settings saved successfully';
  } catch (error) {
      console.error('Failed to save settings:', error);
      return 'Error saving settings';
  }
}

ipcMain.on('submit_Add_Entry', async (event, formData) => {
  try {
      console.log("calling createUserInventoryEntry...")
      console.log(formData);
      const result = await userEntries.createUserInventoryEntry(formData.prefix, formData.partNumber, formData.quantity, formData.warehouse, formData.zone, formData.seller, formData.manufacturer, formData.condition, formData.unitCost, formData.notes, null, formData.type);
      console.log("result of createUserInventoryEntry: ", result);
      event.reply('submit_Add_Entry_Response', result);
      showSuccessInfoDialog()
            
  } catch (error) {
      // Handle the error
      console.error('Error in submit_Add_Entry:', error);
      event.reply('submit_Add_Entry_Response', { error: error.message });
      showErrorInfoDialog()
  }
});


ipcMain.on('auto_Add_Entry', async (event, data) => {
  try {
    console.log("calling bulkCreate in auto_Add_Entry with data: ", data);
    await userEntries.bulkCreateUserInventoryEntry(data);
            
  } catch (error) {
      // Handle the error
      console.error('Error in auto_Add_Entry:', error);
      event.reply('auto_Add_Entry_Response', { error: error.message });
      showErrorInfoDialog()
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
/* 
ipcMain.handle('copy_file', async (event, destination) => {
  try {
      destination = path.join(destination, 'inventory_backup.db');
      const source = path.join(__dirname, '../backend/inventory.db')
      await fs.promises.copyFile(source, destination);
      return 'File copied successfully';
  } catch (error) {
      console.error('Failed to copy file:', error);
      return 'Error copying file';
  }
});
*/

ipcMain.handle('copy_file', async (event, destination) => {
  try{
    destination = path.join(destination, 'inventory_backup.db');
    await write_User_Settings(destination, 'backupLocation');
    return 'File copied successfully';
  }catch(error){
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
    console.log("calling get_CSV_Data...");
    console.log(filePath);
    const result = await csvParsing.parseCSV(filePath);

    console.log("result of get_CSV_Data: ", result);
    event.reply('get_CSV_Data_Response', result);
  }catch(error){
    console.error('Error in get_CSV_Data:', error);
    event.reply('get_CSV_Data_Response', { error: error.message });
  }
});

ipcMain.on('deleteInventoryEntry', async (event, id) => {
  try {
    // Show a confirmation dialog before proceeding
    const response = await dialog.showMessageBox({
      type: 'question',
      buttons: ['Cancel', 'Delete'],
      defaultId: 0,
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this entry?',
    });

    // Check if the user clicked 'Delete'
    if (response.response === 1) {
      console.log("calling deleteInventoryEntry...");
      console.log(id);
      const result = await userEntries.deleteInventoryEntry(id);

      console.log("result of deleteInventoryEntry: ", result);
      event.reply('deleteInventoryEntry_Response', result);
    } else {
      // User cancelled the operation
      event.reply('deleteInventoryEntry_Response', { cancelled: true });
    }
  } catch (error) {
    console.error('Error in deleteInventoryEntry:', error);
    event.reply('deleteInventoryEntry_Response', { error: error.message });
  }
});

ipcMain.on('deleteInventoryEntry', async (event, id) => {
  try{
    console.log("calling deleteInventoryEntry...");
    console.log(id);
    const result = await userEntries.deleteInventoryEntry(id);

    console.log("result of deleteInventoryEntry: ", result);

    event.reply('deleteInventoryEntry_Response', result);
  }catch(error){
    console.error('Error in deleteInventoryEntry:', error);
    event.reply('deleteInventoryEntry_Response', { error: error.message });
  }
});
