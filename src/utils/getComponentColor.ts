import { converter, formatHex } from 'culori'

import { clamp } from './clamp'

const COMPONENT_COLOR_LIGHTNESS_STEP = 0.06
const COMPONENT_COLOR_MAX_LIGHTNESS = 0.72

export const getComponentColor = (baseColor: string, nestingLevel: number): string => {
  const color = converter('oklch')(baseColor)

  if (!color) {
    return baseColor
  }

  return formatHex({
    ...color,
    l: clamp(
      color.l + nestingLevel * COMPONENT_COLOR_LIGHTNESS_STEP,
      color.l,
      COMPONENT_COLOR_MAX_LIGHTNESS,
    ).toNumber(),
  })
}
