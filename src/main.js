import { app, BrowserWindow, ipcMain } from 'electron'; // Add ipcMain to the imports
import path from 'node:path';
import started from 'electron-squirrel-startup';
import fs from 'fs'; // Add fs import
import os from 'os'; // Add os import

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  // Add the IPC handlers here, after app is ready
  ipcMain.handle('create-filesystem-item', async (event, { name, type, parentPath }) => {
    try {
      const basePath = path.join(os.homedir(), 'my-project');
      const fullPath = parentPath ? path.join(basePath, parentPath, name) : path.join(basePath, name);

      if (type === 'folder') {
        fs.mkdirSync(fullPath, { recursive: true });
      } else {
        fs.writeFileSync(fullPath, '');
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('get-file-structure', async () => {
    const basePath = path.join(os.homedir(), 'my-project');
    return readDirectoryRecursive(basePath);
  });



  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Helper function to read directory structure
function readDirectoryRecursive(dirPath, relativePath = '') {
  const items = fs.readdirSync(dirPath);
  const structure = [];

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stats = fs.statSync(fullPath);
    const itemRelativePath = relativePath ? `${relativePath}/${item}` : item;

    if (stats.isDirectory()) {
      structure.push({
        name: item,
        type: 'folder',
        children: readDirectoryRecursive(fullPath, itemRelativePath)
      });
    } else {
      structure.push({
        name: item,
        type: 'file'
      });
    }
  }

  return structure;
}