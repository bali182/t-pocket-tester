import { atom } from 'jotai'

import { LANDSCAPE_ISO_CARD_SIZE } from './constants'
import type { CardHolderInput, SectionId } from './types'

export const cardHolderInputAtom = atom<CardHolderInput>({
  cardSize: LANDSCAPE_ISO_CARD_SIZE,
  pocketCount: 3,
  stitchMargin: 4,
  cardSideClearanceFromStitch: 5,
  cardBottomClearanceFromStitch: 1,
  pocketSpacing: 15,
  tPocketTabWidth: 8,
  tPocketTaper: 20,
  visibleCardHeight: 10,
})

export const isInputDrawerOpenAtom = atom(false)

export const inputSectionOpenStateAtom = atom<Record<SectionId, boolean>>({
  card: true,
  pockets: true,
  stitching: true,
})
