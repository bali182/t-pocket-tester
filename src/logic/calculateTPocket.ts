import type { CardHolderInput } from '../schemas/CardHolderInputSchema'
import type { TPocketModel } from '../schemas/TPocketModelSchema'
import { calculatePocketHeight, calculatePocketWidth, calculateTPocketY } from './utils'

export const calculateTPocket = (input: CardHolderInput, index: number): TPocketModel => {
  const pocketWidth = calculatePocketWidth(input)
  const pocketHeight = calculatePocketHeight(input)
  const y = calculateTPocketY(input, index)
  const tabBottomY = y + input.pocketSpacing
  const bottomY = y + pocketHeight
  const topLeft = { x: 0, y }
  const topRight = { x: pocketWidth, y }
  const rightTabBottom = { x: pocketWidth, y: tabBottomY }
  const rightTrapezoidTop = { x: pocketWidth - input.tPocketTabWidth, y: tabBottomY }
  const rightBottom = { x: pocketWidth - input.tPocketTaper, y: bottomY }
  const leftBottom = { x: input.tPocketTaper, y: bottomY }
  const leftTrapezoidTop = { x: input.tPocketTabWidth, y: tabBottomY }
  const leftTabBottom = { x: 0, y: tabBottomY }

  return {
    kind: 'tPocket',
    index,
    topLeft,
    topRight,
    rightTabBottom,
    rightTrapezoidTop,
    rightBottom,
    leftBottom,
    leftTrapezoidTop,
    leftTabBottom,
    outline: {
      points: [
        topLeft,
        topRight,
        rightTabBottom,
        rightTrapezoidTop,
        rightBottom,
        leftBottom,
        leftTrapezoidTop,
        leftTabBottom,
      ],
    },
  }
}
