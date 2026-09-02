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
} from '../src/schemas/fileManagement'
import { getPreloadPath, getRendererPath } from './buildPaths'
import { fileManagementApi, fileManagementIpcChannels } from './fileManagementApi'

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

ipcMain.handle(fileManagementIpcChannels.dialog, (_event, request: unknown) => {
  if (!typia.is<FileDialogRequestSchema>(request)) {
    return { type: 'error' }
  }
  return fileManagementApi.dialog(request)
})

ipcMain.handle(fileManagementIpcChannels.findExistingFilePaths, (_event, request: unknown) => {
  if (!typia.is<FileFindExistingFilePathsRequestSchema>(request)) {
    return { type: 'error' }
  }
  return fileManagementApi.findExistingFilePaths(request)
})

ipcMain.handle(fileManagementIpcChannels.read, (_event, request: unknown) => {
  if (!typia.is<FileReadRequestSchema>(request)) {
    return { type: 'error' }
  }
  return fileManagementApi.read(request)
})

ipcMain.handle(fileManagementIpcChannels.suggestPath, (_event, request: unknown) => {
  if (!typia.is<FileSuggestPathRequestSchema>(request)) {
    return { type: 'error' }
  }
  return fileManagementApi.suggestPath(request)
})

ipcMain.handle(fileManagementIpcChannels.validateCreatePath, (_event, request: unknown) => {
  if (!typia.is<FileValidateCreatePathRequestSchema>(request)) {
    return { type: 'error' }
  }
  return fileManagementApi.validateCreatePath(request)
})

ipcMain.handle(fileManagementIpcChannels.write, (_event, request: unknown) => {
  if (!typia.is<FileWriteRequestSchema>(request)) {
    return { type: 'error' }
  }
  return fileManagementApi.write(request)
})

Menu.setApplicationMenu(null)

void app.whenReady().then(createMainWindow)

app.on('window-all-closed', () => {
  app.quit()
})
