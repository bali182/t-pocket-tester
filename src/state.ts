import { atom, createStore } from 'jotai'

import { LANDSCAPE_ISO_CARD_SIZE } from './constants'
import type { CardHolderInputSchema } from './schemas/CardHolderInputSchema'
import type { SectionIdSchema } from './schemas/SectionIdSchema'

export const appStore = createStore()

export const DEFAULT_CARD_HOLDER_INPUT: CardHolderInputSchema = {
  cardSize: LANDSCAPE_ISO_CARD_SIZE,
  pocketCount: 3,
  stitchMargin: 4,
  cardSideClearanceFromStitch: 5,
  cardBottomClearanceFromStitch: 1,
  pocketSpacing: 12,
  tPocketTabWidth: 8,
  tPocketTaper: 20,
  pocketHeight: 50,
}

export const DEFAULT_IS_INPUT_DRAWER_OPEN = false

export const DEFAULT_SCALE = 1

export const DEFAULT_INPUT_SECTION_OPEN_STATE: Record<SectionIdSchema, boolean> = {
  card: true,
  pockets: true,
  stitching: true,
}

export const cardHolderInputAtom = atom<CardHolderInputSchema>(DEFAULT_CARD_HOLDER_INPUT)

export const isInputDrawerOpenAtom = atom(DEFAULT_IS_INPUT_DRAWER_OPEN)

export const scaleAtom = atom(DEFAULT_SCALE)

export const inputSectionOpenStateAtom = atom<Record<SectionIdSchema, boolean>>(DEFAULT_INPUT_SECTION_OPEN_STATE)
