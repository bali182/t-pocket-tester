import { useAtom } from 'jotai'
import { ThemeSchema } from '../schemas/theme'
import { themeAtom } from '../state/themeAtom'

type UseThemeResult = {
  theme: ThemeSchema
  setTheme: (schema: ThemeSchema) => void
}

export const useTheme = (): UseThemeResult => {
  const [theme, setTheme] = useAtom(themeAtom)
  return { theme, setTheme }
}
