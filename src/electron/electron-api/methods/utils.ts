import { app } from 'electron'
import { join } from 'node:path'

export const hasErrorCode = (error: unknown, expectedCode: string): boolean => {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return false
  }

  return error.code === expectedCode
}

export const getThemeFilePath = (): string => {
  return join(app.getPath('userData'), 'theme.json')
}
