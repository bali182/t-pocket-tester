import { nativeTheme } from 'electron'
import { readFile } from 'node:fs/promises'
import typia from 'typia'

import type { GlobalSettingsSchema } from '../../../common/schemas/settings'
import { createDefaultGlobalSettings } from '../../../common/utils/createDefaultGlobalSettings'
import { getSettingsFilePath } from './utils'

export const getSettings = async (): Promise<GlobalSettingsSchema> => {
  try {
    const contents = await readFile(getSettingsFilePath(), 'utf8')
    const settings: unknown = JSON.parse(contents)

    if (typia.is<GlobalSettingsSchema>(settings)) {
      return settings
    }
  } catch (error) {
    console.error('Unable to read Electron settings:', error)
  }

  return createDefaultGlobalSettings(nativeTheme.shouldUseDarkColors ? 'dark' : 'light')
}
