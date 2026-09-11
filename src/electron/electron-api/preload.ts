import { contextBridge, ipcRenderer } from 'electron'
import { ElectronApi } from '../schemas/electronApi'
import { electronIpcChannels } from './electronIpcChannels'

const electronApi: ElectronApi = {
  dialog: (request) => ipcRenderer.invoke(electronIpcChannels.dialog, request),
  findExistingFilePaths: (request) => ipcRenderer.invoke(electronIpcChannels.findExistingFilePaths, request),
  getSettings: () => ipcRenderer.invoke(electronIpcChannels.getSettings),
  getTheme: () => ipcRenderer.invoke(electronIpcChannels.getTheme),
  read: (request) => ipcRenderer.invoke(electronIpcChannels.read, request),
  setSettings: (request) => ipcRenderer.invoke(electronIpcChannels.setSettings, request),
  setTheme: (request) => ipcRenderer.invoke(electronIpcChannels.setTheme, request),
  suggestPath: (request) => ipcRenderer.invoke(electronIpcChannels.suggestPath, request),
  validateCreatePath: (request) => ipcRenderer.invoke(electronIpcChannels.validateCreatePath, request),
  write: (request) => ipcRenderer.invoke(electronIpcChannels.write, request),
}

contextBridge.exposeInMainWorld('electronApi', electronApi)
