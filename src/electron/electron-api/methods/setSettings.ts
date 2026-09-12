import { writeFile } from 'node:fs/promises'

import type { GlobalSettingsSchema } from '../../../common/schemas/settings'
import { isDefined } from '../../../common/utils/isDefined'
import type { SettingsSetRequestSchema, SettingsSetResponseSchema } from '../../schemas/electronApi'
import { getSettingsFilePath } from './utils'

type PendingSettingsWrite = {
  reject: (error: unknown) => void
  resolve: () => void
  settings: GlobalSettingsSchema
}

const pendingSettingsWrites: PendingSettingsWrite[] = []
let isWritingSettings = false

export const setSettings = async (request: SettingsSetRequestSchema): Promise<SettingsSetResponseSchema> => {
  try {
    await enqueueSettingsWrite(request.settings)

    return {
      settings: request.settings,
      type: 'settings-set-succeeded',
    }
  } catch (error) {
    console.error('Unable to save settings:', error)
    return { type: 'error' }
  }
}

const enqueueSettingsWrite = (settings: GlobalSettingsSchema): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    pendingSettingsWrites.push({ reject, resolve, settings })
    startSettingsWriteQueue()
  })
}

const startSettingsWriteQueue = (): void => {
  if (isWritingSettings || pendingSettingsWrites.length === 0) {
    return
  }

  isWritingSettings = true
  flushSettingsWriteQueue()
}

const flushSettingsWriteQueue = async (): Promise<void> => {
  try {
    while (true) {
      const pendingWrite = pendingSettingsWrites.shift()

      if (!isDefined(pendingWrite)) {
        return
      }

      try {
        await writeFile(getSettingsFilePath(), JSON.stringify(pendingWrite.settings), 'utf8')
        pendingWrite.resolve()
      } catch (error) {
        pendingWrite.reject(error)
      }
    }
  } finally {
    isWritingSettings = false
    startSettingsWriteQueue()
  }
}
