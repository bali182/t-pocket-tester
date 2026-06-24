import type { CardHolderInput, Size } from '../types'

export const calculatePocketWidth = (input: CardHolderInput): number => {
  return input.cardSize.width + 2 * (input.stitchMargin + input.cardSideClearanceFromStitch)
}

export const calculatePocketHeight = (input: CardHolderInput): number => {
  return input.cardSize.height - input.visibleCardHeight + input.cardBottomClearanceFromStitch + input.stitchMargin
}

export const calculateTPocketCount = (input: CardHolderInput): number => {
  return input.pocketCount - 1
}

export const calculateOverallSize = (input: CardHolderInput): Size => {
  return {
    width: calculatePocketWidth(input),
    height: calculatePocketHeight(input) + calculateTPocketCount(input) * input.pocketSpacing,
  }
}

export const calculateTPocketY = (input: CardHolderInput, index: number): number => {
  return index * input.pocketSpacing
}

export const calculatePlainPocketY = (input: CardHolderInput): number => {
  return calculateTPocketCount(input) * input.pocketSpacing
}
