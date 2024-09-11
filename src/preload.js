const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    checkUpdate: (version) => ipcRenderer.invoke('check-update', version),
    downloadUpdate: () => ipcRenderer.invoke('download-update'),
    getThemes: () => ipcRenderer.invoke('get-themes'),
    uploadTheme: (formData) => ipcRenderer.invoke('upload-theme', formData)
});
