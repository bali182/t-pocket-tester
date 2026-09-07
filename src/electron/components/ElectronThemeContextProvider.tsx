import type { FC, PropsWithChildren } from 'react'
import { useCallback, useMemo, useState } from 'react'

import type { ThemeContextValue } from '../../common/contexts/ThemeContext'
import { ThemeContext } from '../../common/contexts/ThemeContext'
import type { ThemeSchema } from '../../common/schemas/theme'
import { setDocumentBackgroundColor } from '../../common/utils/setDocumentBackgroundColor'
import { electronApi } from '../electronApi'

type ElectronThemeContextProviderProps = PropsWithChildren<{
  initialTheme: ThemeSchema
}>

export const ElectronThemeContextProvider: FC<ElectronThemeContextProviderProps> = ({ children, initialTheme }) => {
  const [theme, setCurrentTheme] = useState<ThemeSchema>(initialTheme)

  const setTheme = useCallback(async (nextTheme: ThemeSchema): Promise<void> => {
    const response = await electronApi.setTheme({ theme: nextTheme, type: 'set-theme' })

    if (response.type === 'theme-set') {
      setDocumentBackgroundColor(response.theme)
      setCurrentTheme(response.theme)
    }
  }, [])

  const value = useMemo<ThemeContextValue>(() => ({ setTheme, theme }), [setTheme, theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
