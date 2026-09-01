import type { HasTypeSchema } from './common'

export type FileDialogOpenRequestSchema = HasTypeSchema<'dialog-open'> & {
  fileFilterLabel: string
}

export type FilePathOpenRequestSchema = HasTypeSchema<'path-open'> & {
  filePath: string
}

export type FileOpenRequestSchema = FileDialogOpenRequestSchema | FilePathOpenRequestSchema

export type FileOpenCancelledResponseSchema = HasTypeSchema<'open-cancelled'>

export type FileOpenSucceededResponseSchema = HasTypeSchema<'open-succeeded'> & {
  contents: string
  filePath: string
}

export type FileOpenFailedResponseSchema = HasTypeSchema<'open-failed'>

export type FileOpenResponseSchema =
  | FileOpenCancelledResponseSchema
  | FileOpenSucceededResponseSchema
  | FileOpenFailedResponseSchema

export type FileDialogSaveRequestSchema = HasTypeSchema<'dialog-save'> & {
  contents: string
  fileFilterLabel: string
  suggestedFileName: string
}

export type FilePathSaveRequestSchema = HasTypeSchema<'path-save'> & {
  contents: string
  filePath: string
}

export type FileSaveRequestSchema = FileDialogSaveRequestSchema | FilePathSaveRequestSchema

export type FileSaveCancelledResponseSchema = HasTypeSchema<'save-cancelled'>

export type FileSaveSucceededResponseSchema = HasTypeSchema<'save-succeeded'> & {
  filePath: string
}

export type FileSaveFailedResponseSchema = HasTypeSchema<'save-failed'>

export type FileSaveResponseSchema =
  | FileSaveCancelledResponseSchema
  | FileSaveSucceededResponseSchema
  | FileSaveFailedResponseSchema

export type FileExistRequestSchema = HasTypeSchema<'exists'> & {
  filePaths: string[]
}

export type FileExistSucceededResponseSchema = HasTypeSchema<'exists-succeeded'> & {
  existingFilePaths: string[]
}

export type FileExistFailedResponseSchema = HasTypeSchema<'exists-failed'>

export type FileExistResponseSchema = FileExistSucceededResponseSchema | FileExistFailedResponseSchema

export type FileApiSchema = {
  exists: (request: FileExistRequestSchema) => Promise<FileExistResponseSchema>
  open: (request: FileOpenRequestSchema) => Promise<FileOpenResponseSchema>
  save: (request: FileSaveRequestSchema) => Promise<FileSaveResponseSchema>
}
