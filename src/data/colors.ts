export const grayScaleColors = {
  black: '#000000',
  darkGray: '#4c5156',
  mediumGray: '#7d8489',
  lightGray: '#bdc4c9',
  white: '#fdfdfc',
} as const

export const leatherColors = {
  ...grayScaleColors,
  darkBrown: '#633116',
  mediumBrown: '#9a5328',
  lightBrown: '#cb8146',
  natural: '#dea673',
  bone: '#efe0cd',

  burgundy: '#8a1e29',
  red: '#ce353d',
  pink: '#e98c95',
  orange: '#e6622e',
  yellow: '#eeae38',

  navy: '#163a5e',
  indigo: '#344c87',
  mediumBlue: '#3b80b5',
  lightBlue: '#7cb2d6',
  purple: '#8a4c8a',

  darkGreen: '#1d5528',
  olive: '#6a7029',
  mediumGreen: '#428c42',
  lightGreen: '#89c382',
  cyan: '#4aaab0',
} as const

export type GrayScaleColorKey = keyof typeof grayScaleColors
export type LeatherColorKey = keyof typeof leatherColors

export type ColorKey = GrayScaleColorKey | LeatherColorKey
