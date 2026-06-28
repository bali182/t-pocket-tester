type RgbColor = {
  alpha?: number
  red: number
  green: number
  blue: number
}

type HslColor = {
  hue: number
  saturation: number
  lightness: number
}

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

const hexToRgb = (color: string): RgbColor => {
  const normalizedColor = color.replace('#', '')

  return {
    red: Number.parseInt(normalizedColor.slice(0, 2), 16),
    green: Number.parseInt(normalizedColor.slice(2, 4), 16),
    blue: Number.parseInt(normalizedColor.slice(4, 6), 16),
    alpha: normalizedColor.length === 8 ? Number.parseInt(normalizedColor.slice(6, 8), 16) : undefined,
  }
}

const toHex = (value: number): string => {
  return Math.round(value).toString(16).padStart(2, '0')
}

const rgbToHex = ({ red, green, blue }: RgbColor): string => {
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`
}

const rgbToHsl = ({ red, green, blue }: RgbColor): HslColor => {
  const normalizedRed = red / 255
  const normalizedGreen = green / 255
  const normalizedBlue = blue / 255
  const max = Math.max(normalizedRed, normalizedGreen, normalizedBlue)
  const min = Math.min(normalizedRed, normalizedGreen, normalizedBlue)
  const delta = max - min
  const lightness = (max + min) / 2

  if (delta === 0) {
    return {
      hue: 0,
      saturation: 0,
      lightness,
    }
  }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1))

  if (max === normalizedRed) {
    return {
      hue: ((normalizedGreen - normalizedBlue) / delta + (normalizedGreen < normalizedBlue ? 6 : 0)) / 6,
      saturation,
      lightness,
    }
  }

  if (max === normalizedGreen) {
    return {
      hue: ((normalizedBlue - normalizedRed) / delta + 2) / 6,
      saturation,
      lightness,
    }
  }

  return {
    hue: ((normalizedRed - normalizedGreen) / delta + 4) / 6,
    saturation,
    lightness,
  }
}

const hslToRgb = ({ hue, saturation, lightness }: HslColor): RgbColor => {
  if (saturation === 0) {
    const channel = lightness * 255

    return {
      red: channel,
      green: channel,
      blue: channel,
    }
  }

  const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation
  const p = 2 * lightness - q

  const hueToRgbChannel = (channelHue: number): number => {
    let adjustedHue = channelHue

    if (adjustedHue < 0) {
      adjustedHue += 1
    }

    if (adjustedHue > 1) {
      adjustedHue -= 1
    }

    if (adjustedHue < 1 / 6) {
      return p + (q - p) * 6 * adjustedHue
    }

    if (adjustedHue < 1 / 2) {
      return q
    }

    if (adjustedHue < 2 / 3) {
      return p + (q - p) * (2 / 3 - adjustedHue) * 6
    }

    return p
  }

  return {
    red: hueToRgbChannel(hue + 1 / 3) * 255,
    green: hueToRgbChannel(hue) * 255,
    blue: hueToRgbChannel(hue - 1 / 3) * 255,
  }
}

export const adjustColorLightness = (color: string, amount: number): string => {
  const hslColor = rgbToHsl(hexToRgb(color))

  return rgbToHex(
    hslToRgb({
      ...hslColor,
      lightness: clamp(hslColor.lightness + clamp(amount, -1, 1), 0, 1),
    }),
  )
}

export const setOpacity = (color: string, opacity: number): string => {
  const safeOpacity = Math.max(0, Math.min(1, opacity))
  const alpha = Math.round(safeOpacity * 255)
  const { red, green, blue } = hexToRgb(color)
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}${toHex(alpha)}`
}
