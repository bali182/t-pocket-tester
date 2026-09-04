import type { FileApiSchema, NativePlatformSchema } from '../schemas/fileManagement'

type FileManagementWindow = Window & {
  fileManagement?: FileApiSchema
}

const getFileManagementApi = (): FileApiSchema => {
  const fileManagementWindow: FileManagementWindow = window

  if (fileManagementWindow.fileManagement === undefined) {
    throw new Error('File management is unavailable outside Electron')
  }

  return fileManagementWindow.fileManagement
}

export const fileManagement: FileApiSchema = {
  dialog: (request) => getFileManagementApi().dialog(request),
  findExistingFilePaths: (request) => getFileManagementApi().findExistingFilePaths(request),
  read: (request) => getFileManagementApi().read(request),
  suggestPath: (request) => getFileManagementApi().suggestPath(request),
  validateCreatePath: (request) => getFileManagementApi().validateCreatePath(request),
  write: (request) => getFileManagementApi().write(request),
  get platform(): NativePlatformSchema {
    return getFileManagementApi().platform
  },
}
