import type { Size } from '../schemas/SizeSchema'
import type { TPocketModel } from '../schemas/TPocketModelSchema'

export const calculateTPocketSize = (pocket: TPocketModel): Size => {
  return {
    width: pocket.topRight.x - pocket.topLeft.x,
    height: Math.max(pocket.leftBottom.y, pocket.rightBottom.y) - pocket.topLeft.y,
  }
}
