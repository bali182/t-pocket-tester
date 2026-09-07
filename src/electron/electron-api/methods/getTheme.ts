import { nativeTheme } from 'electron'
import { readFile } from 'node:fs/promises'
import typia from 'typia'

import type { ThemeSchema } from '../../../common/schemas/theme'
import { getThemeFilePath } from './utils'

export const getTheme = async (): Promise<ThemeSchema> => {
  try {
    const contents = await readFile(getThemeFilePath(), 'utf8')
    const theme: unknown = JSON.parse(contents)

    if (typia.is<ThemeSchema>(theme)) {
      return theme
    }
  } catch (error) {
    console.error('Unable to read Electron theme:', error)
  }

  return nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
}
