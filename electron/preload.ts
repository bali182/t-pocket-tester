import { contextBridge, ipcRenderer } from 'electron'
import type { FileApiSchema } from '../src/schemas/fileManagement'
import { fileManagementIpcChannels } from './fileManagementApi'

const fileManagementApi: FileApiSchema = {
  dialog: (request) => ipcRenderer.invoke(fileManagementIpcChannels.dialog, request),
  findExistingFilePaths: (request) => ipcRenderer.invoke(fileManagementIpcChannels.findExistingFilePaths, request),
  read: (request) => ipcRenderer.invoke(fileManagementIpcChannels.read, request),
  suggestPath: (request) => ipcRenderer.invoke(fileManagementIpcChannels.suggestPath, request),
  validateCreatePath: (request) => ipcRenderer.invoke(fileManagementIpcChannels.validateCreatePath, request),
  write: (request) => ipcRenderer.invoke(fileManagementIpcChannels.write, request),
}

contextBridge.exposeInMainWorld('fileManagement', fileManagementApi)
