import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fileManagementApi, fileManagementIpcChannels } from './fileManagementApi'
import { isFileExistRequestSchema, isFileOpenRequestSchema, isFileSaveRequestSchema } from './typeGuards'

const currentDirectory = dirname(fileURLToPath(import.meta.url))

const createMainWindow = async (): Promise<void> => {
  const mainWindow = new BrowserWindow({
    titleBarStyle: 'default',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: join(currentDirectory, '../preload/preload.mjs'),
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

ipcMain.handle(fileManagementIpcChannels.exists, (_event, request: unknown) => {
  if (!isFileExistRequestSchema(request)) {
    return { type: 'exists-failed' }
  }
  return fileManagementApi.exists(request)
})

ipcMain.handle(fileManagementIpcChannels.open, (_event, request: unknown) => {
  if (!isFileOpenRequestSchema(request)) {
    return { type: 'open-failed' }
  }
  return fileManagementApi.open(request)
})

ipcMain.handle(fileManagementIpcChannels.save, (_event, request: unknown) => {
  if (!isFileSaveRequestSchema(request)) {
    return { type: 'save-failed' }
  }
  return fileManagementApi.save(request)
})

Menu.setApplicationMenu(null)

void app.whenReady().then(createMainWindow)

app.on('window-all-closed', () => {
  app.quit()
})
