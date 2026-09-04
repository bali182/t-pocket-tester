import BigNumber from 'bignumber.js'

import type { PointSchema, RectSchema } from '../../schemas/geometry'
import { isDefined } from '../../utils/isDefined'

export const calculateStitchLineBoundingRect = (points: PointSchema[]): RectSchema => {
  const firstPoint = points[0]

  if (!isDefined(firstPoint)) {
    return {
      x: new BigNumber(0),
      y: new BigNumber(0),
      width: new BigNumber(0),
      height: new BigNumber(0),
    }
  }

  let minX = firstPoint.x
  let minY = firstPoint.y
  let maxX = firstPoint.x
  let maxY = firstPoint.y

  for (const point of points) {
    minX = BigNumber.minimum(minX, point.x)
    minY = BigNumber.minimum(minY, point.y)
    maxX = BigNumber.maximum(maxX, point.x)
    maxY = BigNumber.maximum(maxY, point.y)
  }

  return {
    x: minX,
    y: minY,
    width: maxX.minus(minX),
    height: maxY.minus(minY),
  }
}
