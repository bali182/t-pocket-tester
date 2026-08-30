import BigNumber from 'bignumber.js'

import type { ComputedStitchHoleSchema } from '../../schemas/computed'
import type { LineSchema, PointSchema } from '../../schemas/geometry'
import { getPointDistance } from '../geometryUtils'

export const getStitchHoleLine = (center: PointSchema, rotation: number, stitchHoleLength: number): LineSchema => {
  const angleInRadians = new BigNumber(45).plus(rotation).times(Math.PI).div(180)
  const halfLength = new BigNumber(stitchHoleLength).div(2)

  // TODO replace BigNumber lib to one that has sin/cos.
  const dx = new BigNumber(Math.cos(angleInRadians.toNumber())).times(halfLength)
  const dy = new BigNumber(Math.sin(angleInRadians.toNumber())).times(halfLength)

  return {
    start: { x: center.x.minus(dx), y: center.y.minus(dy) },
    end: { x: center.x.plus(dx), y: center.y.plus(dy) },
  }
}

export const getClosestStitchLine = (
  firstHole: ComputedStitchHoleSchema,
  secondHole: ComputedStitchHoleSchema,
): LineSchema => {
  const firstPoints = [firstHole.line.start, firstHole.line.end]
  const secondPoints = [secondHole.line.start, secondHole.line.end]
  let closestLine: LineSchema = { start: firstPoints[0], end: secondPoints[0] }
  let closestDistance = getPointDistance(closestLine.start, closestLine.end)

  for (const firstPoint of firstPoints) {
    for (const secondPoint of secondPoints) {
      const distance = getPointDistance(firstPoint, secondPoint)

      if (distance.isLessThan(closestDistance)) {
        closestLine = { start: firstPoint, end: secondPoint }
        closestDistance = distance
      }
    }
  }

  return closestLine
}
