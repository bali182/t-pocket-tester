import { Translation } from 'intl-t/react'

import { EN } from './en'
import { HU } from './hu'

export const translation = new Translation({
  locales: {
    hu: HU,
    en: EN,
  },
  defaultLocale: 'en',
})

export const useTranslation = translation.useTranslation

export type TranslationSchema = typeof translation.current
