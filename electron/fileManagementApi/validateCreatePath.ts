import { constants } from 'node:fs'
import { access, stat } from 'node:fs/promises'
import { dirname, isAbsolute } from 'node:path'
import type {
  FileCreatePathAvailableResponseSchema,
  FileCreatePathExistingResponseSchema,
  FileCreatePathInvalidResponseSchema,
  FileValidateCreatePathRequestSchema,
  FileValidateCreatePathResponseSchema,
} from '../../src/schemas/fileManagement'
import { hasErrorCode } from './utils'

export const validateCreatePath = async (
  request: FileValidateCreatePathRequestSchema,
): Promise<FileValidateCreatePathResponseSchema> => {
  try {
    if (!isAbsolute(request.filePath)) {
      return { type: 'create-path-invalid' }
    }

    const parentPath = dirname(request.filePath)
    const parentInfo = await stat(parentPath)

    if (!parentInfo.isDirectory()) {
      return { type: 'create-path-invalid' }
    }

    await access(parentPath, constants.W_OK)

    return await getCreatePathValidationResult(request.filePath)
  } catch (error) {
    if (isInvalidPathError(error)) {
      return { type: 'create-path-invalid' }
    }

    return { type: 'error' }
  }
}

const getCreatePathValidationResult = async (
  filePath: string,
): Promise<
  FileCreatePathAvailableResponseSchema | FileCreatePathExistingResponseSchema | FileCreatePathInvalidResponseSchema
> => {
  try {
    const fileInfo = await stat(filePath)
    return fileInfo.isFile() ? { type: 'create-path-existing' } : { type: 'create-path-invalid' }
  } catch (error) {
    if (hasErrorCode(error, 'ENOENT')) {
      return { type: 'create-path-available' }
    }

    if (isInvalidPathError(error)) {
      return { type: 'create-path-invalid' }
    }

    throw error
  }
}

const isInvalidPathError = (error: unknown): boolean => {
  return (
    hasErrorCode(error, 'EACCES') ||
    hasErrorCode(error, 'EINVAL') ||
    hasErrorCode(error, 'ENAMETOOLONG') ||
    hasErrorCode(error, 'ENOENT') ||
    hasErrorCode(error, 'ENOTDIR') ||
    hasErrorCode(error, 'EPERM')
  )
}
