import { contextBridge, ipcRenderer } from 'electron'
import { ElectronApi } from '../schemas/electronApi'
import { electronIpcChannels } from './electronApi'

const electronApi: ElectronApi = {
  dialog: (request) => ipcRenderer.invoke(electronIpcChannels.dialog, request),
  findExistingFilePaths: (request) => ipcRenderer.invoke(electronIpcChannels.findExistingFilePaths, request),
  read: (request) => ipcRenderer.invoke(electronIpcChannels.read, request),
  suggestPath: (request) => ipcRenderer.invoke(electronIpcChannels.suggestPath, request),
  validateCreatePath: (request) => ipcRenderer.invoke(electronIpcChannels.validateCreatePath, request),
  write: (request) => ipcRenderer.invoke(electronIpcChannels.write, request),
  platform: process.platform,
}

contextBridge.exposeInMainWorld('electronApi', electronApi)
