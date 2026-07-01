import { hexToArgb } from './hexToRgb'

const toHex = (value: number): string => {
  return Math.round(value).toString(16).padStart(2, '0')
}

export const setOpacity = (color: string, opacity: number): string => {
  const safeOpacity = Math.max(0, Math.min(1, opacity))
  const alpha = Math.round(safeOpacity * 255)
  const { red, green, blue } = hexToArgb(color)

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}${toHex(alpha)}`
}
