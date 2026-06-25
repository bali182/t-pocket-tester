import type { CardHolderInput, TPocketModel } from '../types'
import { calculatePocketHeight, calculatePocketWidth, calculateTPocketY } from './utils'

export const calculateTPocket = (input: CardHolderInput, index: number): TPocketModel => {
  const pocketWidth = calculatePocketWidth(input)
  const pocketHeight = calculatePocketHeight(input)
  const y = calculateTPocketY(input, index)
  const tabBottomY = y + input.pocketSpacing
  const bottomY = y + pocketHeight

  return {
    kind: 'tPocket',
    index,
    outline: {
      points: [
        { x: 0, y },
        { x: pocketWidth, y },
        { x: pocketWidth, y: tabBottomY },
        { x: pocketWidth - input.tPocketTabWidth, y: tabBottomY },
        { x: pocketWidth - input.tPocketTaper, y: bottomY },
        { x: input.tPocketTaper, y: bottomY },
        { x: input.tPocketTabWidth, y: tabBottomY },
        { x: 0, y: tabBottomY },
      ],
    },
  }
}
