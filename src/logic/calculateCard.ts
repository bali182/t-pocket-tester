import type { CardModel, CardHolderInput } from '../types'
import { calculatePlainPocketY, calculateTPocketCount, calculateTPocketY } from './utils'

export const calculateCard = (input: CardHolderInput, index: number): CardModel => {
  const tPocketCount = calculateTPocketCount(input)
  const pocketY = index < tPocketCount ? calculateTPocketY(input, index) : calculatePlainPocketY(input)

  return {
    kind: 'card',
    index,
    outline: {
      x: input.stitchMargin + input.cardSideClearanceFromStitch,
      y: pocketY - input.visibleCardHeight,
      width: input.cardSize.width,
      height: input.cardSize.height,
    },
  }
}
