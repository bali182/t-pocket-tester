import { useCallback, useEffect, useMemo } from 'react'

import type { ThemeSchema } from '../schemas/theme'
import { setDocumentBackgroundColor } from '../utils/setDocumentBackgroundColor'
import { useGlobalSettings } from './useGlobalSettings'

export type UseThemeOutput = {
  setTheme: (theme: ThemeSchema) => void
  theme: ThemeSchema
}

export const useTheme = (): UseThemeOutput => {
  const { setAppSettings, settings } = useGlobalSettings()
  const theme = settings.app.theme

  const setTheme = useCallback(
    (theme: ThemeSchema): void => {
      setAppSettings({ theme })
    },
    [setAppSettings],
  )

  useEffect(() => {
    setDocumentBackgroundColor(theme)
  }, [theme])

  return useMemo<UseThemeOutput>(() => ({ setTheme, theme }), [setTheme, theme])
}
