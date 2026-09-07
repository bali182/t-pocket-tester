import type { ThemeSchema } from '../schemas/theme'

export const getSystemTheme = (): ThemeSchema => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
