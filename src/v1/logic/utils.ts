import type { CardHolderInputSchema } from '../schemas/CardHolderInputSchema'
import type { PointSchema } from '../schemas/PointSchema'
import type { RectSchema } from '../schemas/RectSchema'
import type { SizeSchema } from '../schemas/SizeSchema'

export const calculatePocketWidth = (input: CardHolderInputSchema): number => {
  return input.cardSize.width + 2 * (input.stitchMargin + input.cardSideClearanceFromStitch)
}

export const calculatePocketHeight = (input: CardHolderInputSchema): number => {
  return input.pocketHeight
}

export const calculateTPocketCount = (input: CardHolderInputSchema): number => {
  return input.pocketCount - 1
}

export const calculateTopInset = (input: CardHolderInputSchema): number => {
  return (
    input.cardSize.height -
    input.pocketHeight +
    input.cardBottomClearanceFromStitch +
    input.stitchMargin +
    input.stitchMargin
  )
}

export const calculateOverallSize = (input: CardHolderInputSchema): SizeSchema => {
  return {
    width: calculatePocketWidth(input),
    height:
      calculateTopInset(input) + calculatePocketHeight(input) + calculateTPocketCount(input) * input.pocketSpacing,
  }
}

export const calculateTPocketY = (input: CardHolderInputSchema, index: number): number => {
  return calculateTopInset(input) + index * input.pocketSpacing
}

export const calculateTopPocketY = (input: CardHolderInputSchema): number => {
  return calculateTopInset(input) + calculateTPocketCount(input) * input.pocketSpacing
}

export const translatePoint = (point: PointSchema, dx: number, dy: number): PointSchema => {
  return {
    x: point.x + dx,
    y: point.y + dy,
  }
}

export const getViewBox = (strokeWidth: number, boundingBox: RectSchema): string => {
  const strokePadding = strokeWidth / 2
  return `${boundingBox.x - strokePadding} ${boundingBox.y - strokePadding} ${boundingBox.width + strokePadding * 2} ${boundingBox.height + strokePadding * 2}`
}
