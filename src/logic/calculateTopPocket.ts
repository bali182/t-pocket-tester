import type { CardHolderInput, TopPocketModel } from '../types'
import { calculatePocketHeight, calculatePocketWidth, calculateTopPocketY } from './utils'

export const calculateTopPocket = (input: CardHolderInput): TopPocketModel => {
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
