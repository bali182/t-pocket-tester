import type { FileApiSchema } from '../schemas/fileManagement'

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
  exists: (request) => getFileManagementApi().exists(request),
  open: (request) => getFileManagementApi().open(request),
  save: (request) => getFileManagementApi().save(request),
}
