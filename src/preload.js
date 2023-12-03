const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    submit_Add_Entry: (formData) => ipcRenderer.send('submit_Add_Entry', formData),
    submit_Add_Entry_Response: (callback) => ipcRenderer.on('submit_Add_Entry_Response', callback)
});

