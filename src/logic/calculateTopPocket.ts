import type { CardHolderInputSchema } from '../schemas/CardHolderInputSchema'
import type { TopPocketSchema } from '../schemas/TopPocketSchema'
import { calculatePocketHeight, calculatePocketWidth, calculateTopPocketY } from './utils'

export const calculateTopPocket = (input: CardHolderInputSchema): TopPocketSchema => {
  return {
    kind: 'topPocket',
    outline: {
      x: 0,
      y: calculateTopPocketY(input),
      width: calculatePocketWidth(input),
      height: calculatePocketHeight(input),
    },
  }
}
