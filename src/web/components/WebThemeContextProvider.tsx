import { useAtom } from 'jotai'
import type { FC, PropsWithChildren } from 'react'
import { useEffect, useMemo } from 'react'

import type { ThemeContextValue } from '../../common/contexts/ThemeContext'
import { ThemeContext } from '../../common/contexts/ThemeContext'
import { setDocumentBackgroundColor } from '../../common/utils/setDocumentBackgroundColor'
import { themeAtom } from '../state/themeAtom'

export const WebThemeContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useAtom(themeAtom)
  const value = useMemo<ThemeContextValue>(() => ({ setTheme, theme }), [setTheme, theme])

  useEffect((): void => {
    setDocumentBackgroundColor(theme)
  }, [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
