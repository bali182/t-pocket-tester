import { EN } from './en'
import { HU } from './hu'
import type { TranslationSchema } from './translationSchema'

export const useTranslation = (): TranslationSchema => {
  const navLanguage = navigator.language
  switch (navLanguage) {
    case 'hu':
      return HU
    default:
      return EN
  }
}
