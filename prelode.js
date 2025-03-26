const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    toggleOverlay: (action) => ipcRenderer.send('toggle-overlay', action)
});