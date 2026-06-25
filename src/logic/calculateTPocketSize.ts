import { Size, TPocketModel } from '../types'

export const calculateTPocketSize = (pocket: TPocketModel): Size => {
  return {
    width: pocket.topRight.x - pocket.topLeft.x,
    height: Math.max(pocket.leftBottom.y, pocket.rightBottom.y) - pocket.topLeft.y,
  }
}
