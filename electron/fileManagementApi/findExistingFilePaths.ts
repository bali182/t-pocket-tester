import { stat } from 'node:fs/promises'
import type {
  FileFindExistingFilePathsRequestSchema,
  FileFindExistingFilePathsResponseSchema,
} from '../../src/schemas/fileManagement'
import { hasErrorCode } from './utils'

export const findExistingFilePaths = async (
  request: FileFindExistingFilePathsRequestSchema,
): Promise<FileFindExistingFilePathsResponseSchema> => {
  try {
    const existingFilePaths = await Promise.all(request.filePaths.map(getExistingFilePath))

    return {
      type: 'existing-file-paths',
      filePaths: existingFilePaths.filter((filePath): filePath is string => filePath !== undefined),
    }
  } catch {
    return { type: 'error' }
  }
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
