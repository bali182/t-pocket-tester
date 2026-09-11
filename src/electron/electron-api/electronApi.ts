import { ElectronApi } from '../schemas/electronApi'
import { dialog } from './methods/dialog'
import { findExistingFilePaths } from './methods/findExistingFilePaths'
import { getSettings } from './methods/getSettings'
import { getTheme } from './methods/getTheme'
import { read } from './methods/read'
import { setSettings } from './methods/setSettings'
import { setTheme } from './methods/setTheme'
import { suggestPath } from './methods/suggestPath'
import { validateCreatePath } from './methods/validateCreatePath'
import { write } from './methods/write'

export const _electronApi: ElectronApi = {
  dialog,
  findExistingFilePaths,
  getSettings,
  getTheme,
  read,
  setSettings,
  setTheme,
  suggestPath,
  validateCreatePath,
  write,
}
