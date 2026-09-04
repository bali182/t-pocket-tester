import BigNumber from 'bignumber.js'

import type { LineSchema, PointSchema } from '../../schemas/geometry'

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
