import { Translation } from 'intl-t/react'

import { HU } from './hu'

export const translation = new Translation({ locales: { hu: HU } })

export const useTranslation = translation.useTranslation

export type TranslationSchema = typeof translation.current
