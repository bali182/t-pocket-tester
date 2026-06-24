import type { CardHolderInput, PlainPocket } from '../types'
import { calculatePlainPocketY, calculatePocketHeight, calculatePocketWidth } from './utils'

export const calculatePlainPocket = (input: CardHolderInput): PlainPocket => {
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
