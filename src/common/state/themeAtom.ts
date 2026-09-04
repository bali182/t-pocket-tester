import { atom } from 'jotai'

import type { ThemeSchema } from '../schemas/theme'
import { readThemeFromStorage, saveThemeToStorage } from './storage'

const themeStorageAtom = atom<ThemeSchema>(readThemeFromStorage())

export const themeAtom = atom(
  (get): ThemeSchema => get(themeStorageAtom),
  (_get, set, nextTheme: ThemeSchema): void => {
    set(themeStorageAtom, nextTheme)
    saveThemeToStorage(nextTheme)
  },
)
