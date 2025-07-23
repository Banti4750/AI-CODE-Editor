// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// const { contextBridge, ipcRenderer } = require('electron');
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    getFileStructure: () => ipcRenderer.invoke('get-file-structure'),
    createFilesystemItem: (data) => ipcRenderer.invoke('create-filesystem-item', data)
});