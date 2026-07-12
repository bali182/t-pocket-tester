import BigNumber from 'bignumber.js'

import type { PocketClusterSchema } from '../schemas/components'
import type { RectSchema } from '../schemas/geometry'
import { calculatePocketDepth } from './pocketUtils'

export const calculatePocketBoundingBox = (
  pocketCluster: PocketClusterSchema,
  rect: RectSchema,
  index: number,
): RectSchema => {
  const pocketDepth = calculatePocketDepth(pocketCluster, rect)

  switch (pocketCluster.orientation) {
    case 'up':
      return {
        x: rect.x,
        y: new BigNumber(rect.y).plus(new BigNumber(index).times(pocketCluster.pocketStep)).toNumber(),
        width: rect.width,
        height: pocketDepth.toNumber(),
      }
    case 'down':
      return {
        x: rect.x,
        y: new BigNumber(rect.y)
          .plus(new BigNumber(pocketCluster.pocketCount).minus(1).minus(index).times(pocketCluster.pocketStep))
          .toNumber(),
        width: rect.width,
        height: pocketDepth.toNumber(),
      }
    case 'left':
      return {
        x: new BigNumber(rect.x).plus(new BigNumber(index).times(pocketCluster.pocketStep)).toNumber(),
        y: rect.y,
        width: pocketDepth.toNumber(),
        height: rect.height,
      }
    case 'right':
      return {
        x: new BigNumber(rect.x)
          .plus(new BigNumber(pocketCluster.pocketCount).minus(1).minus(index).times(pocketCluster.pocketStep))
          .toNumber(),
        y: rect.y,
        width: pocketDepth.toNumber(),
        height: rect.height,
      }
  }
}
