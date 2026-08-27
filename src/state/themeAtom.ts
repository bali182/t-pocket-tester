import { atom } from 'jotai'

import type { ThemeAppearanceSchema } from '../schemas/theme'
import { readThemeFromStorage, saveThemeToStorage } from './storage'

const themeStorageAtom = atom<ThemeAppearanceSchema>(readThemeFromStorage())

export const themeAtom = atom(
  (get): ThemeAppearanceSchema => get(themeStorageAtom),
  (_get, set, nextTheme: ThemeAppearanceSchema): void => {
    set(themeStorageAtom, nextTheme)
    saveThemeToStorage(nextTheme)
  },
)
