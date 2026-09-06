import type { ElectronApi, NativePlatformSchema } from './schemas/electronApi'

type _ElectronWindow = Window & {
  electronApi?: ElectronApi
}

const api = (): ElectronApi => {
  const w: _ElectronWindow = window

  if (w.electronApi === undefined) {
    throw new Error('File management is unavailable outside Electron')
  }

  return w.electronApi
}

export const electronApi: ElectronApi = {
  dialog: (request) => api().dialog(request),
  findExistingFilePaths: (request) => api().findExistingFilePaths(request),
  read: (request) => api().read(request),
  suggestPath: (request) => api().suggestPath(request),
  validateCreatePath: (request) => api().validateCreatePath(request),
  write: (request) => api().write(request),
  get platform(): NativePlatformSchema {
    return api().platform
  },
}
