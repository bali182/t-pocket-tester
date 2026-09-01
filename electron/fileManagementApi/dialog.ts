import { dialog as electronDialog, type OpenDialogOptions, type SaveDialogOptions } from 'electron'
import type {
  FileDialogDirectoryReadRequestSchema,
  FileDialogFileReadRequestSchema,
  FileDialogRequestSchema,
  FileDialogResponseSchema,
  FileDialogWriteRequestSchema,
} from '../../src/schemas/fileManagement'

export const dialog = async (request: FileDialogRequestSchema): Promise<FileDialogResponseSchema> => {
  if (request.type === 'write') {
    return showWriteDialog(request)
  }

  if (request.target === 'directory') {
    return showDirectoryReadDialog(request)
  }

  return showFileReadDialog(request)
}

const showFileReadDialog = async (request: FileDialogFileReadRequestSchema): Promise<FileDialogResponseSchema> => {
  try {
    const options: OpenDialogOptions = {
      properties: ['openFile'],
      ...(request.buttonLabel !== undefined ? { buttonLabel: request.buttonLabel } : {}),
      ...(request.defaultPath !== undefined ? { defaultPath: request.defaultPath } : {}),
      ...(request.fileFilter !== undefined
        ? { filters: [{ extensions: [request.fileFilter.extension], name: request.fileFilter.name }] }
        : {}),
      ...(request.message !== undefined ? { message: request.message } : {}),
      ...(request.title !== undefined ? { title: request.title } : {}),
    }
    const result = await electronDialog.showOpenDialog(options)

    if (result.canceled) {
      return { type: 'cancelled' }
    }

    const filePath = result.filePaths[0]

    if (filePath === undefined) {
      return { type: 'error' }
    }

    return { type: 'selected', filePath }
  } catch {
    return { type: 'error' }
  }
}

const showDirectoryReadDialog = async (
  request: FileDialogDirectoryReadRequestSchema,
): Promise<FileDialogResponseSchema> => {
  try {
    const options: OpenDialogOptions = {
      properties: ['openDirectory'],
      ...(request.buttonLabel !== undefined ? { buttonLabel: request.buttonLabel } : {}),
      ...(request.defaultPath !== undefined ? { defaultPath: request.defaultPath } : {}),
      ...(request.message !== undefined ? { message: request.message } : {}),
      ...(request.title !== undefined ? { title: request.title } : {}),
    }
    const result = await electronDialog.showOpenDialog(options)

    if (result.canceled) {
      return { type: 'cancelled' }
    }

    const filePath = result.filePaths[0]

    if (filePath === undefined) {
      return { type: 'error' }
    }

    return { type: 'selected', filePath }
  } catch {
    return { type: 'error' }
  }
}

const showWriteDialog = async (request: FileDialogWriteRequestSchema): Promise<FileDialogResponseSchema> => {
  try {
    const options: SaveDialogOptions = {
      ...(request.buttonLabel !== undefined ? { buttonLabel: request.buttonLabel } : {}),
      ...(request.defaultPath !== undefined ? { defaultPath: request.defaultPath } : {}),
      ...(request.fileFilter !== undefined
        ? { filters: [{ extensions: [request.fileFilter.extension], name: request.fileFilter.name }] }
        : {}),
      ...(request.message !== undefined ? { message: request.message } : {}),
      ...(request.title !== undefined ? { title: request.title } : {}),
    }
    const result = await electronDialog.showSaveDialog(options)

    if (result.canceled) {
      return { type: 'cancelled' }
    }

    if (result.filePath === '') {
      return { type: 'error' }
    }

    return { type: 'selected', filePath: result.filePath }
  } catch {
    return { type: 'error' }
  }
}
