import type { CardHolderInput, PlainPocket } from '../types'
import { calculatePocketHeight, calculatePocketWidth } from './utils'

export const calculatePlainPocket = (input: CardHolderInput): PlainPocket => {
  return {
    kind: 'plainPocket',
    outline: {
      x: 0,
      y: 0,
      width: calculatePocketWidth(input),
      height: calculatePocketHeight(input),
    },
  }
}
