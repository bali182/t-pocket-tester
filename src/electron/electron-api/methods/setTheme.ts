import { writeFile } from 'node:fs/promises'

import type { ThemeSetRequestSchema, ThemeSetResponseSchema } from '../../schemas/electronApi'
import { getThemeFilePath } from './utils'

export const setTheme = async (request: ThemeSetRequestSchema): Promise<ThemeSetResponseSchema> => {
  try {
    await writeFile(getThemeFilePath(), JSON.stringify(request.theme), 'utf8')

    return { theme: request.theme, type: 'theme-set' }
  } catch (error) {
    console.error('Unable to save Electron theme:', error)
    return { type: 'error' }
  }
}
