import { EN } from './en'
import { HU } from './hu'
import type { TranslationSchema } from './translationSchema'

export const useTranslation = (): TranslationSchema => {
  const language = new Intl.Locale(navigator.language).language

  switch (language) {
    case 'hu':
      return HU
    default:
      return EN
  }
}
