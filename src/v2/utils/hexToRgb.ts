import { ArgbColorSchema } from '../schemas/colors'

export const hexToArgb = (color: string): ArgbColorSchema => {
  const normalizedColor = color.replace('#', '')

  return {
    red: Number.parseInt(normalizedColor.slice(0, 2), 16),
    green: Number.parseInt(normalizedColor.slice(2, 4), 16),
    blue: Number.parseInt(normalizedColor.slice(4, 6), 16),
    alpha: normalizedColor.length === 8 ? Number.parseInt(normalizedColor.slice(6, 8), 16) : undefined,
  }
}
