import { ElectronApi } from '../schemas/electronApi'
import { dialog } from './methods/dialog'
import { findExistingFilePaths } from './methods/findExistingFilePaths'
import { read } from './methods/read'
import { suggestPath } from './methods/suggestPath'
import { validateCreatePath } from './methods/validateCreatePath'
import { write } from './methods/write'

export const electronIpcChannels = {
  dialog: 'file-management:dialog',
  findExistingFilePaths: 'file-management:find-existing-file-paths',
  read: 'file-management:read',
  suggestPath: 'file-management:suggest-path',
  validateCreatePath: 'file-management:validate-create-path',
  write: 'file-management:write',
} as const

export const _electronApi: ElectronApi = {
  dialog,
  findExistingFilePaths,
  read,
  suggestPath,
  validateCreatePath,
  write,
}
