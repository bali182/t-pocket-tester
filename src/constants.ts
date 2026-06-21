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
