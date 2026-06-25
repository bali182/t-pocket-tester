import type { TPocketModel } from '../types'
import { translatePoint } from './utils'

export const transformTPocketToOrigin = (pocket: TPocketModel): TPocketModel => {
  const dx = -pocket.topLeft.x
  const dy = -pocket.topLeft.y
  const topLeft = translatePoint(pocket.topLeft, dx, dy)
  const topRight = translatePoint(pocket.topRight, dx, dy)
  const rightTabBottom = translatePoint(pocket.rightTabBottom, dx, dy)
  const rightTrapezoidTop = translatePoint(pocket.rightTrapezoidTop, dx, dy)
  const rightBottom = translatePoint(pocket.rightBottom, dx, dy)
  const leftBottom = translatePoint(pocket.leftBottom, dx, dy)
  const leftTrapezoidTop = translatePoint(pocket.leftTrapezoidTop, dx, dy)
  const leftTabBottom = translatePoint(pocket.leftTabBottom, dx, dy)

  return {
    kind: pocket.kind,
    index: pocket.index,
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
