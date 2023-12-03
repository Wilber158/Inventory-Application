const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    submit_Add_Entry: (formData) => ipcRenderer.send('submit_Add_Entry', formData),
    submit_Add_Entry_Response: (callback) => ipcRenderer.on('submit_Add_Entry_Response', callback),
    get_Inventory_Entries: (formData) => ipcRenderer.send('get_Inventory_Entries', formData),
    get_Inventory_Entries_Response: (callback) => ipcRenderer.on('get_Inventory_Entries_Response', callback)
});

