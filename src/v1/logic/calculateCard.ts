import type { CardHolderInputSchema } from '../schemas/CardHolderInputSchema'
import type { CardSchema } from '../schemas/CardSchema'
import { calculatePocketHeight, calculateTopPocketY, calculateTPocketCount, calculateTPocketY } from './utils'

export const calculateCard = (input: CardHolderInputSchema, index: number): CardSchema => {
  const tPocketCount = calculateTPocketCount(input)
  const pocketY = index < tPocketCount ? calculateTPocketY(input, index) : calculateTopPocketY(input)
  const pocketBottomY = pocketY + calculatePocketHeight(input)
  const cardBottomY = pocketBottomY - (input.cardBottomClearanceFromStitch + input.stitchMargin)

  return {
    kind: 'card',
    index,
    outline: {
      x: input.stitchMargin + input.cardSideClearanceFromStitch,
      y: cardBottomY - input.cardSize.height,
      width: input.cardSize.width,
      height: input.cardSize.height,
    },
  }
}
