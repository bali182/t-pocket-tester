import type {
  FileDialogOpenRequestSchema,
  FileDialogSaveRequestSchema,
  FileExistRequestSchema,
  FileOpenRequestSchema,
  FilePathOpenRequestSchema,
  FilePathSaveRequestSchema,
  FileSaveRequestSchema,
} from '../src/schemas/fileManagement'

export const isFileOpenRequestSchema = (value: unknown): value is FileOpenRequestSchema => {
  return isFileDialogOpenRequestSchema(value) || isFilePathOpenRequestSchema(value)
}

const isFileDialogOpenRequestSchema = (value: unknown): value is FileDialogOpenRequestSchema => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<FileDialogOpenRequestSchema>

  return candidate.type === 'dialog-open' && typeof candidate.fileFilterLabel === 'string'
}

const isFilePathOpenRequestSchema = (value: unknown): value is FilePathOpenRequestSchema => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<FilePathOpenRequestSchema>

  return candidate.type === 'path-open' && typeof candidate.filePath === 'string'
}

export const isFileSaveRequestSchema = (value: unknown): value is FileSaveRequestSchema => {
  return isFileDialogSaveRequestSchema(value) || isFilePathSaveRequestSchema(value)
}

const isFileDialogSaveRequestSchema = (value: unknown): value is FileDialogSaveRequestSchema => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<FileDialogSaveRequestSchema>

  return (
    candidate.type === 'dialog-save' &&
    typeof candidate.contents === 'string' &&
    typeof candidate.fileFilterLabel === 'string' &&
    typeof candidate.suggestedFileName === 'string'
  )
}

const isFilePathSaveRequestSchema = (value: unknown): value is FilePathSaveRequestSchema => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<FilePathSaveRequestSchema>

  return (
    candidate.type === 'path-save' && typeof candidate.contents === 'string' && typeof candidate.filePath === 'string'
  )
}

export const isFileExistRequestSchema = (value: unknown): value is FileExistRequestSchema => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<FileExistRequestSchema>

  return (
    candidate.type === 'exists' &&
    Array.isArray(candidate.filePaths) &&
    candidate.filePaths.every((filePath) => typeof filePath === 'string')
  )
}
