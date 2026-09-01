import { contextBridge, ipcRenderer } from 'electron'
import type { FileApiSchema } from '../src/schemas/fileManagement'
import { fileManagementIpcChannels } from './fileManagementApi'

const fileManagementApi: FileApiSchema = {
  exists: (request) => ipcRenderer.invoke(fileManagementIpcChannels.exists, request),
  open: (request) => ipcRenderer.invoke(fileManagementIpcChannels.open, request),
  save: (request) => ipcRenderer.invoke(fileManagementIpcChannels.save, request),
}

contextBridge.exposeInMainWorld('fileManagement', fileManagementApi)
