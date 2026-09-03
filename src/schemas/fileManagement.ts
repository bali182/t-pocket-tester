import type { HasTypeSchema } from './common'

export type NativePlatformSchema =
  | 'aix'
  | 'android'
  | 'darwin'
  | 'freebsd'
  | 'haiku'
  | 'linux'
  | 'openbsd'
  | 'sunos'
  | 'win32'
  | 'cygwin'
  | 'netbsd'

export type FileCancelledResponseSchema = HasTypeSchema<'cancelled'>

export type FileErrorResponseSchema = HasTypeSchema<'error'>

export type FileReadRequestSchema = HasTypeSchema<'read'> & {
  filePath: string
}

export type FileReadSucceededResponseSchema = HasTypeSchema<'read-succeeded'> & {
  contents: string
}

export type FileReadResponseSchema = FileReadSucceededResponseSchema | FileErrorResponseSchema

export type FileWriteRequestSchema = HasTypeSchema<'write'> & {
  contents: string
  filePath: string
}

export type FileWriteSucceededResponseSchema = HasTypeSchema<'write-succeeded'>

export type FileWriteResponseSchema = FileWriteSucceededResponseSchema | FileErrorResponseSchema

export type FileDialogPresentationSchema = {
  buttonLabel?: string
  defaultPath?: string
  message?: string
  title?: string
}

export type FileDialogFileFilterSchema = {
  extension: string
  name: string
}

export type FileDialogFileReadRequestSchema = HasTypeSchema<'read'> &
  FileDialogPresentationSchema & {
    fileFilter?: FileDialogFileFilterSchema
    target: 'file'
  }

export type FileDialogDirectoryReadRequestSchema = HasTypeSchema<'read'> &
  FileDialogPresentationSchema & {
    target: 'directory'
  }

export type FileDialogReadRequestSchema = FileDialogFileReadRequestSchema | FileDialogDirectoryReadRequestSchema

export type FileDialogWriteRequestSchema = HasTypeSchema<'write'> &
  FileDialogPresentationSchema & {
    fileFilter?: FileDialogFileFilterSchema
  }

export type FileDialogRequestSchema = FileDialogReadRequestSchema | FileDialogWriteRequestSchema

export type FileDialogSelectedResponseSchema = HasTypeSchema<'selected'> & {
  filePath: string
}

export type FileDialogResponseSchema =
  | FileDialogSelectedResponseSchema
  | FileCancelledResponseSchema
  | FileErrorResponseSchema

export type FileFindExistingFilePathsRequestSchema = HasTypeSchema<'find-existing-file-paths'> & {
  filePaths: string[]
}

export type FileExistingFilePathsResponseSchema = HasTypeSchema<'existing-file-paths'> & {
  filePaths: string[]
}

export type FileFindExistingFilePathsResponseSchema = FileExistingFilePathsResponseSchema | FileErrorResponseSchema

export type FileSuggestPathRequestSchema = HasTypeSchema<'suggest-path'> & {
  extension: string
  fileName: string
}

export type FileSuggestedPathResponseSchema = HasTypeSchema<'suggested-path'> & {
  filePath: string
}

export type FileSuggestPathResponseSchema = FileSuggestedPathResponseSchema | FileErrorResponseSchema

export type FileValidateCreatePathRequestSchema = HasTypeSchema<'validate-create-path'> & {
  filePath: string
}

export type FileCreatePathAvailableResponseSchema = HasTypeSchema<'create-path-available'>

export type FileCreatePathExistingResponseSchema = HasTypeSchema<'create-path-existing'>

export type FileCreatePathInvalidResponseSchema = HasTypeSchema<'create-path-invalid'>

export type FileValidateCreatePathResponseSchema =
  | FileCreatePathAvailableResponseSchema
  | FileCreatePathExistingResponseSchema
  | FileCreatePathInvalidResponseSchema
  | FileErrorResponseSchema

export type FileApiSchema = {
  dialog: (request: FileDialogRequestSchema) => Promise<FileDialogResponseSchema>
  findExistingFilePaths: (
    request: FileFindExistingFilePathsRequestSchema,
  ) => Promise<FileFindExistingFilePathsResponseSchema>
  read: (request: FileReadRequestSchema) => Promise<FileReadResponseSchema>
  suggestPath: (request: FileSuggestPathRequestSchema) => Promise<FileSuggestPathResponseSchema>
  validateCreatePath: (request: FileValidateCreatePathRequestSchema) => Promise<FileValidateCreatePathResponseSchema>
  write: (request: FileWriteRequestSchema) => Promise<FileWriteResponseSchema>
  platform: NativePlatformSchema
}
