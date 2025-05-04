const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { createServer } = require('./server/index');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    // show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      offscreen: true // Рендеринг в памяти
    }
  });

  mainWindow.loadURL('https://chat.deepseek.com/sign_in');
}

app.whenReady().then(() => {
  createWindow();
  createServer(ipcMain, mainWindow); // Запускаем сервер

  mainWindow.openDevTools()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


