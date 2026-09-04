import type BigNumber from 'bignumber.js'

import type { PointSchema } from '../schemas/geometry'

export const getPointDistance = (first: PointSchema, second: PointSchema): BigNumber => {
  const deltaX = first.x.minus(second.x)
  const deltaY = first.y.minus(second.y)
  return deltaX.times(deltaX).plus(deltaY.times(deltaY)).sqrt()
}
