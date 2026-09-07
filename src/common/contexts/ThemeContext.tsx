import { createContext } from 'react'

import type { ThemeSchema } from '../schemas/theme'

export type ThemeContextValue = {
  setTheme: (theme: ThemeSchema) => void
  theme: ThemeSchema
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
