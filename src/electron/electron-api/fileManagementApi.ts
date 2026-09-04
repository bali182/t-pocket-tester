import { FileApiSchema } from '../../common/schemas/fileManagement'
import { dialog } from './fileManagementApi/dialog'
import { findExistingFilePaths } from './fileManagementApi/findExistingFilePaths'
import { read } from './fileManagementApi/read'
import { suggestPath } from './fileManagementApi/suggestPath'
import { validateCreatePath } from './fileManagementApi/validateCreatePath'
import { write } from './fileManagementApi/write'

export const fileManagementIpcChannels = {
  dialog: 'file-management:dialog',
  findExistingFilePaths: 'file-management:find-existing-file-paths',
  read: 'file-management:read',
  suggestPath: 'file-management:suggest-path',
  validateCreatePath: 'file-management:validate-create-path',
  write: 'file-management:write',
} as const

export const fileManagementApi: FileApiSchema = {
  dialog,
  findExistingFilePaths,
  read,
  suggestPath,
  validateCreatePath,
  write,
  platform: process.platform,
}
