import { BACKGROUND_COLORS } from '../constants/colors'
import type { ThemeSchema } from '../schemas/theme'

export const setDocumentBackgroundColor = (theme: ThemeSchema): void => {
  const color = BACKGROUND_COLORS[theme]

  document.documentElement.style.backgroundColor = color
  document.body.style.backgroundColor = color
}
