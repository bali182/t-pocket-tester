import { atom } from 'jotai'
import type { SetStateAction } from 'react'

import type { GlobalSettingsSchema } from '../../common/schemas/settings'
import { readGlobalSettingsFromStorage, saveGlobalSettingsToStorage } from '../../common/state/storage'
import { createDefaultGlobalSettings } from '../../common/utils/createDefaultGlobalSettings'
import { getSystemTheme } from '../../common/utils/getSystemTheme'

const globalSettingsStorageAtom = atom<GlobalSettingsSchema>(
  readGlobalSettingsFromStorage(createDefaultGlobalSettings(getSystemTheme())),
)

export const globalSettingsAtom = atom(
  (get): GlobalSettingsSchema => get(globalSettingsStorageAtom),
  (get, set, update: SetStateAction<GlobalSettingsSchema>): void => {
    const currentSettings = get(globalSettingsStorageAtom)
    const nextSettings = typeof update === 'function' ? update(currentSettings) : update

    set(globalSettingsStorageAtom, nextSettings)
    saveGlobalSettingsToStorage(nextSettings)
  },
)
