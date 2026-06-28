import type { CardHolderInput, Point, Rect, Size } from '../types'

export const calculatePocketWidth = (input: CardHolderInput): number => {
  return input.cardSize.width + 2 * (input.stitchMargin + input.cardSideClearanceFromStitch)
}

export const calculatePocketHeight = (input: CardHolderInput): number => {
  return input.pocketHeight
}

export const calculateTPocketCount = (input: CardHolderInput): number => {
  return input.pocketCount - 1
}

export const calculateTopInset = (input: CardHolderInput): number => {
  return (
    input.cardSize.height -
    input.pocketHeight +
    input.cardBottomClearanceFromStitch +
    input.stitchMargin +
    input.stitchMargin
  )
}

export const calculateOverallSize = (input: CardHolderInput): Size => {
  return {
    width: calculatePocketWidth(input),
    height:
      calculateTopInset(input) + calculatePocketHeight(input) + calculateTPocketCount(input) * input.pocketSpacing,
  }
}

export const calculateTPocketY = (input: CardHolderInput, index: number): number => {
  return calculateTopInset(input) + index * input.pocketSpacing
}

export const calculateTopPocketY = (input: CardHolderInput): number => {
  return calculateTopInset(input) + calculateTPocketCount(input) * input.pocketSpacing
}

export const translatePoint = (point: Point, dx: number, dy: number): Point => {
  return {
    x: point.x + dx,
    y: point.y + dy,
  }
}

export const getViewBox = (strokeWidth: number, boundingBox: Rect): string => {
  const strokePadding = strokeWidth / 2
  return `${boundingBox.x - strokePadding} ${boundingBox.y - strokePadding} ${boundingBox.width + strokePadding * 2} ${boundingBox.height + strokePadding * 2}`
}
