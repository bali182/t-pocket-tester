import { app, BrowserWindow, Menu } from 'electron'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDirectory = dirname(fileURLToPath(import.meta.url))

const createMainWindow = async (): Promise<void> => {
  const mainWindow = new BrowserWindow({
    titleBarStyle: 'default',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })
  const devServerUrl = process.env.ELECTRON_RENDERER_URL

  if (devServerUrl !== undefined) {
    await mainWindow.loadURL(devServerUrl)
  } else {
    await mainWindow.loadFile(join(currentDirectory, '../renderer/index.html'))
  }

  if (process.argv.includes('--devtools')) {
    mainWindow.webContents.openDevTools()
  }
}

Menu.setApplicationMenu(null)

void app.whenReady().then(createMainWindow)

app.on('window-all-closed', () => {
  app.quit()
})
