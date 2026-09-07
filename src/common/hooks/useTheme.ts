import { useContext } from 'react'

import type { ThemeContextValue } from '../contexts/ThemeContext'
import { ThemeContext } from '../contexts/ThemeContext'
import { isDefined } from '../utils/isDefined'

export const useTheme = (): ThemeContextValue => {
  const themeContext = useContext(ThemeContext)

  if (!isDefined(themeContext)) {
    throw new Error('useTheme must be used inside ThemeContext.Provider')
  }

  return themeContext
}
