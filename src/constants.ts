import type { CardOrientation, Size } from './types'

export const ISO_CARD_WIDTH = 85.6

export const ISO_CARD_HEIGHT = 53.98

export const LANDSCAPE_ISO_CARD_SIZE: Size = {
  width: ISO_CARD_WIDTH,
  height: ISO_CARD_HEIGHT,
}

export const PORTRAIT_ISO_CARD_SIZE: Size = {
  width: ISO_CARD_HEIGHT,
  height: ISO_CARD_WIDTH,
}

export const ISO_CARD_SIZE_BY_ORIENTATION: Record<CardOrientation, Size> = {
  landscape: LANDSCAPE_ISO_CARD_SIZE,
  portrait: PORTRAIT_ISO_CARD_SIZE,
}

export const BACK_PANEL_COLOR = '#532E21'

export const POCKET_COLOR_LIGHTNESS_ADJUSTMENT = 0.08

export const POCKET_OPACITY = 0.8

export const CARD_COLOR = '#1CABFF'

export const CARD_OPACITY = 0.8

export const CARD_RADIUS = 3
