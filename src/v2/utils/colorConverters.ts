export type HsvColor = {
  h: number
  s: number
  v: number
  a?: number
}

const hexColorPattern = /^#?(?<red>[0-9a-f]{2})(?<green>[0-9a-f]{2})(?<blue>[0-9a-f]{2})$/i

const toHexChannel = (value: number): string => {
  return Math.round(value).toString(16).padStart(2, '0')
}

export const hexToHsv = (hex: string): HsvColor => {
  const match = hex.match(hexColorPattern)

  if (!match?.groups) {
    return { h: 0, s: 0, v: 0, a: 1 }
  }

  const red = Number.parseInt(match.groups.red, 16) / 255
  const green = Number.parseInt(match.groups.green, 16) / 255
  const blue = Number.parseInt(match.groups.blue, 16) / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  const saturation = max === 0 ? 0 : delta / max
  let hue = 0

  if (delta !== 0) {
    if (max === red) {
      hue = ((green - blue) / delta) % 6
    } else if (max === green) {
      hue = (blue - red) / delta + 2
    } else {
      hue = (red - green) / delta + 4
    }
  }

  const normalizedHue = Math.round(hue * 60)

  return {
    h: normalizedHue < 0 ? normalizedHue + 360 : normalizedHue,
    s: saturation,
    v: max,
    a: 1,
  }
}

export const hsvToHex = (color: HsvColor): string => {
  const chroma = color.v * color.s
  const hue = color.h / 60
  const secondary = chroma * (1 - Math.abs((hue % 2) - 1))
  const match = color.v - chroma
  let red = 0
  let green = 0
  let blue = 0

  if (hue >= 0 && hue < 1) {
    red = chroma
    green = secondary
  } else if (hue >= 1 && hue < 2) {
    red = secondary
    green = chroma
  } else if (hue >= 2 && hue < 3) {
    green = chroma
    blue = secondary
  } else if (hue >= 3 && hue < 4) {
    green = secondary
    blue = chroma
  } else if (hue >= 4 && hue < 5) {
    red = secondary
    blue = chroma
  } else {
    red = chroma
    blue = secondary
  }

  return `#${toHexChannel((red + match) * 255)}${toHexChannel((green + match) * 255)}${toHexChannel(
    (blue + match) * 255,
  )}`
}
