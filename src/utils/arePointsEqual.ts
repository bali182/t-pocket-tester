import type { PointSchema } from '../schemas/geometry'

export const arePointsEqual = (first: PointSchema, second: PointSchema): boolean => {
  return first.x.isEqualTo(second.x) && first.y.isEqualTo(second.y)
}
