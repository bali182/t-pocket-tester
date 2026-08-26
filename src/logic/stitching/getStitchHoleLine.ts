import BigNumber from 'bignumber.js'

import type { NumberLineSchema } from '../../schemas/geometry'
import type { StitchHoleSchema } from '../../schemas/stitching'

export const getStitchHoleLine = (hole: StitchHoleSchema, stitchHoleLength: number): NumberLineSchema => {
  const angleInRadians = new BigNumber(45).plus(hole.rotation).times(Math.PI).div(180)
  const halfLength = new BigNumber(stitchHoleLength).div(2)

  // TODO replace BigNumber lib to one that has sin/cos.
  const dx = new BigNumber(Math.cos(angleInRadians.toNumber())).times(halfLength)
  const dy = new BigNumber(Math.sin(angleInRadians.toNumber())).times(halfLength)

  const centerX = new BigNumber(hole.center.x)
  const centerY = new BigNumber(hole.center.y)

  return {
    start: { x: centerX.minus(dx).toNumber(), y: centerY.minus(dy).toNumber() },
    end: { x: centerX.plus(dx).toNumber(), y: centerY.plus(dy).toNumber() },
  }
}
