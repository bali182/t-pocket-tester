import { dialog } from 'electron'
import { readFile, stat, writeFile } from 'node:fs/promises'
import type { FileApiSchema } from '../src/schemas/fileManagement'

export const fileManagementIpcChannels = {
  exists: 'file-management:exists',
  open: 'file-management:open',
  save: 'file-management:save',
} as const

export const fileManagementApi: FileApiSchema = {
  exists: async ({ filePaths }) => {
    try {
      const existingFilePaths = await Promise.all(filePaths.map(getExistingFilePath))

      return {
        type: 'exists-succeeded',
        existingFilePaths: existingFilePaths.filter((filePath): filePath is string => filePath !== undefined),
      }
    } catch {
      return { type: 'exists-failed' }
    }
  },
  open: async (request) => {
    try {
      if (request.type === 'path-open') {
        return {
          type: 'open-succeeded',
          contents: await readFile(request.filePath, 'utf8'),
          filePath: request.filePath,
        }
      }

      const result = await dialog.showOpenDialog({
        filters: [{ name: request.fileFilterLabel, extensions: ['json'] }],
        properties: ['openFile'],
      })

      if (result.canceled) {
        return { type: 'open-cancelled' }
      }

      const filePath = result.filePaths[0]

      if (filePath === undefined) {
        return { type: 'open-failed' }
      }

      return {
        type: 'open-succeeded',
        contents: await readFile(filePath, 'utf8'),
        filePath,
      }
    } catch {
      return { type: 'open-failed' }
    }
  },
  save: async (request) => {
    try {
      if (request.type === 'path-save') {
        await writeFile(request.filePath, request.contents, 'utf8')

        return {
          type: 'save-succeeded',
          filePath: request.filePath,
        }
      }

      const result = await dialog.showSaveDialog({
        defaultPath: request.suggestedFileName,
        filters: [{ name: request.fileFilterLabel, extensions: ['json'] }],
      })

      if (result.canceled) {
        return { type: 'save-cancelled' }
      }

      if (result.filePath === undefined) {
        return { type: 'save-failed' }
      }

      await writeFile(result.filePath, request.contents, 'utf8')

      return {
        type: 'save-succeeded',
        filePath: result.filePath,
      }
    } catch {
      return { type: 'save-failed' }
    }
  },
}

const getExistingFilePath = async (filePath: string): Promise<string | undefined> => {
  try {
    const fileInfo = await stat(filePath)
    return fileInfo.isFile() ? filePath : undefined
  } catch (error) {
    if (hasErrorCode(error, 'ENOENT') || hasErrorCode(error, 'ENOTDIR')) {
      return undefined
    }

    throw error
  }
}

const hasErrorCode = (error: unknown, expectedCode: string): boolean => {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return false
  }

  return error.code === expectedCode
}
