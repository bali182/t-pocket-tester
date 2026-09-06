import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import typia from 'typia'
import type {
  FileDialogRequestSchema,
  FileFindExistingFilePathsRequestSchema,
  FileReadRequestSchema,
  FileSuggestPathRequestSchema,
  FileValidateCreatePathRequestSchema,
  FileWriteRequestSchema,
} from '../schemas/electronApi'
import { getPreloadPath, getRendererPath } from './buildPaths'
import { _electronApi, electronIpcChannels } from './electronApi'

const currentDirectory = dirname(fileURLToPath(import.meta.url))

const createMainWindow = async (): Promise<void> => {
  const mainWindow = new BrowserWindow({
    titleBarStyle: 'default',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: getPreloadPath(currentDirectory),
      sandbox: true,
    },
  })

  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.code === 'KeyI' && input.meta && input.alt) {
      event.preventDefault()
      mainWindow.webContents.toggleDevTools()
    }
  })

  const devServerUrl = process.env.ELECTRON_RENDERER_URL

  if (devServerUrl !== undefined) {
    await mainWindow.loadURL(devServerUrl)
  } else {
    await mainWindow.loadFile(getRendererPath(currentDirectory))
  }

  if (process.argv.includes('--devtools')) {
    mainWindow.webContents.openDevTools()
  }
}

ipcMain.handle(electronIpcChannels.dialog, (_event, request: unknown) => {
  if (!typia.is<FileDialogRequestSchema>(request)) {
    return { type: 'error' }
  }
  return _electronApi.dialog(request)
})

ipcMain.handle(electronIpcChannels.findExistingFilePaths, (_event, request: unknown) => {
  if (!typia.is<FileFindExistingFilePathsRequestSchema>(request)) {
    return { type: 'error' }
  }
  return _electronApi.findExistingFilePaths(request)
})

ipcMain.handle(electronIpcChannels.read, (_event, request: unknown) => {
  if (!typia.is<FileReadRequestSchema>(request)) {
    return { type: 'error' }
  }
  return _electronApi.read(request)
})

ipcMain.handle(electronIpcChannels.suggestPath, (_event, request: unknown) => {
  if (!typia.is<FileSuggestPathRequestSchema>(request)) {
    return { type: 'error' }
  }
  return _electronApi.suggestPath(request)
})

ipcMain.handle(electronIpcChannels.validateCreatePath, (_event, request: unknown) => {
  if (!typia.is<FileValidateCreatePathRequestSchema>(request)) {
    return { type: 'error' }
  }
  return _electronApi.validateCreatePath(request)
})

ipcMain.handle(electronIpcChannels.write, (_event, request: unknown) => {
  if (!typia.is<FileWriteRequestSchema>(request)) {
    return { type: 'error' }
  }
  return _electronApi.write(request)
})

Menu.setApplicationMenu(null)

void app.whenReady().then(createMainWindow)

app.on('window-all-closed', () => {
  app.quit()
})
