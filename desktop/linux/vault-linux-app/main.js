const { app, BrowserWindow, ipcMain, nativeTheme, Notification, Tray, Menu } = require('electron');
const path = require('path');
const Store = require('electron-store');
const keytar = require('keytar');

// Security Configuration
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
app.commandLine.appendSwitch('ignore-certificate-errors', 'false');

const store = new Store({
  name: 'vault-config',
  encryptionKey: 'vault-secure-key-2026'
});

let mainWindow = null;
let tray = null;
let isQuitting = false;

// Configuration
const CONFIG = {
  SERVER_URL: process.env.VAULT_SERVER_URL || 'wss://relay.vault-messaging.com/v1/stream',
  API_URL: process.env.VAULT_API_URL || 'https://api.vault-messaging.com/v1',
  EMAIL_SERVICE: 'resend', // Using Resend API (free tier: 100 emails/day)
  EMAIL_FROM: 'noreply@b2g-vault'
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'assets/icon.png'),
    backgroundColor: '#1a1a2e',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      devTools: !app.isPackaged
    },
    show: false,
    frame: true,
    titleBarStyle: 'default'
  });

  // Security Headers
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' wss: https:;"
        ],
        'X-Content-Type-Options': ['nosniff'],
        'X-Frame-Options': ['DENY'],
        'X-XSS-Protection': ['1; mode=block'],
        'Referrer-Policy': ['no-referrer']
      }
    });
  });

  mainWindow.loadFile('renderer/index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Minimize to tray instead of taskbar
  mainWindow.on('minimize', (event) => {
    if (tray) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Prevent new windows
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });
}

function createTray() {
  const trayIcon = path.join(__dirname, 'assets/tray-icon.png');
  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('VAULT Messenger');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    mainWindow.show();
  });
}

// Auto-lock timer
let lockTimer = null;
function resetLockTimer() {
  if (lockTimer) clearTimeout(lockTimer);
  const lockTimeout = store.get('lockTimeout', 300000); // 5 minutes default
  
  lockTimer = setTimeout(() => {
    if (mainWindow) {
      mainWindow.webContents.send('app-locked');
    }
  }, lockTimeout);
}

// IPC Handlers
ipcMain.handle('get-config', () => {
  return CONFIG;
});

ipcMain.handle('store-get', (event, key) => {
  return store.get(key);
});

ipcMain.handle('store-set', (event, key, value) => {
  store.set(key, value);
  return true;
});

ipcMain.handle('store-delete', (event, key) => {
  store.delete(key);
  return true;
});

ipcMain.handle('keychain-set', async (event, service, account, password) => {
  try {
    await keytar.setPassword(service, account, password);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('keychain-get', async (event, service, account) => {
  try {
    const password = await keytar.getPassword(service, account);
    return { success: true, password };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('keychain-delete', async (event, service, account) => {
  try {
    await keytar.deletePassword(service, account);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('show-notification', (event, title, body) => {
  if (Notification.isSupported()) {
    new Notification({
      title: title,
      body: body,
      icon: path.join(__dirname, 'assets/icon.png')
    }).show();
  }
  return true;
});

ipcMain.on('reset-lock-timer', () => {
  resetLockTimer();
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('quit-app', () => {
  isQuitting = true;
  app.quit();
});

// App lifecycle
app.whenReady().then(() => {
  createWindow();
  createTray();
  resetLockTimer();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow.show();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  isQuitting = true;
});

// Secure cleanup on exit
app.on('will-quit', () => {
  if (lockTimer) clearTimeout(lockTimer);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
