import { ElectronApi } from '../schemas/electronApi'
import { dialog } from './methods/dialog'
import { findExistingFilePaths } from './methods/findExistingFilePaths'
import { getTheme } from './methods/getTheme'
import { read } from './methods/read'
import { setTheme } from './methods/setTheme'
import { suggestPath } from './methods/suggestPath'
import { validateCreatePath } from './methods/validateCreatePath'
import { write } from './methods/write'

export const _electronApi: ElectronApi = {
  dialog,
  findExistingFilePaths,
  getTheme,
  read,
  setTheme,
  suggestPath,
  validateCreatePath,
  write,
}
