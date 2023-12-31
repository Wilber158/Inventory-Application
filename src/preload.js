const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    submit_Add_Entry: (formData) => ipcRenderer.send('submit_Add_Entry', formData),
    submit_Add_Entry_Response: (callback) => ipcRenderer.on('submit_Add_Entry_Response', callback),
    get_Inventory_Entries: (formData) => ipcRenderer.send('get_Inventory_Entries', formData),
    get_Inventory_Entries_Response: (callback) => ipcRenderer.on('get_Inventory_Entries_Response', callback),
    get_CSV_Data: (filePath) => ipcRenderer.send('get_CSV_Data', filePath),
    get_CSV_Data_Response: (callback) => ipcRenderer.on('get_CSV_Data_Response', callback),
    get_locations: (formData) => ipcRenderer.send('get_locations', formData),
    get_locations_Response: (callback) => ipcRenderer.on('get_locations_Response', callback),
    selectDirectory: () => ipcRenderer.send('open-directory-dialog'),
    onDirectorySelected: (callback) => ipcRenderer.on('selected-directory', callback),
    copy_file: (destination) => ipcRenderer.invoke('copy_file', destination),
    deleteInventoryEntry: (inventoryEntryId) => ipcRenderer.invoke('deleteInventoryEntry', inventoryEntryId),
    auto_Add_Entry: (data) => ipcRenderer.send('auto_Add_Entry', data),
    auto_Add_Entry_Response: (callback) => ipcRenderer.on('auto_Add_Entry_Response', callback),
    update_Inventory_Entry: (formData) => ipcRenderer.send('update_Inventory_Entry', formData),
    update_Inventory_Entry_Response: (callback) => ipcRenderer.on('update_Inventory_Entry_Response', callback),
    update_Location_Entry: (formData) => ipcRenderer.send('update_Location_Entry', formData),
    update_Location_Entry_Response: (callback) => ipcRenderer.on('update_Location_Entry_Response', callback),
    get_Deleted_Inventory_Entries: () => ipcRenderer.send('get_Deleted_Inventory_Entries'),
    get_Deleted_Inventory_Entries_Response: (callback) => ipcRenderer.on('get_Deleted_Inventory_Entries_Response', callback),
    restoreInventoryEntry: (inventoryEntryId) => ipcRenderer.invoke('restoreInventoryEntry', inventoryEntryId),
});

