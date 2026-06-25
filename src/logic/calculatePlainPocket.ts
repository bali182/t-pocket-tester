import type { CardHolderInput, PlainPocketModel } from '../types'
import { calculatePlainPocketY, calculatePocketHeight, calculatePocketWidth } from './utils'

export const calculatePlainPocket = (input: CardHolderInput): PlainPocketModel => {
  return {
    kind: 'plainPocket',
    outline: {
      x: 0,
      y: calculatePlainPocketY(input),
      width: calculatePocketWidth(input),
      height: calculatePocketHeight(input),
    },
  }
}
