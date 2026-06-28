import type { SizeSchema } from '../schemas/SizeSchema'
import type { TPocketSchema } from '../schemas/TPocketSchema'

export const calculateTPocketSize = (pocket: TPocketSchema): SizeSchema => {
  return {
    width: pocket.topRight.x - pocket.topLeft.x,
    height: Math.max(pocket.leftBottom.y, pocket.rightBottom.y) - pocket.topLeft.y,
  }
}
