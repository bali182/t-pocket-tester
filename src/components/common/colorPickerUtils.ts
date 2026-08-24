import { type Color, parseColor } from '@chakra-ui/react'

export const getColor = (value: string, fallback: string): Color => {
  try {
    return parseColor(value)
  } catch {
    return parseColor(fallback)
  }
}

export const getColorValue = (color: Color): string => {
  return color.getChannelValue('alpha') === 1 ? color.toString('hex') : color.toString('hexa')
}
