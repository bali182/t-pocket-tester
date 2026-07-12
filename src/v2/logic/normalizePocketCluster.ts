import BigNumber from 'bignumber.js'

import type { PocketClusterSchema } from '../schemas/components'
import type { RectSchema } from '../schemas/geometry'
import { clamp } from '../utils/clamp'

export const normalizePocketCluster = (pocketCluster: PocketClusterSchema, rect: RectSchema): PocketClusterSchema => {
  const pocketCount = BigNumber.maximum(
    new BigNumber(pocketCluster.pocketCount).integerValue(BigNumber.ROUND_FLOOR),
    new BigNumber(1),
  )
  const tPocketCount = pocketCount.minus(1)
  const isVertical = pocketCluster.orientation === 'up' || pocketCluster.orientation === 'down'
  const stackLength = isVertical ? rect.height : rect.width
  const crossSize = isVertical ? rect.width : rect.height
  const pocketStep = clamp(
    pocketCluster.pocketStep,
    new BigNumber(0),
    stackLength.dividedBy(BigNumber.maximum(tPocketCount, new BigNumber(1))),
  )
  const halfCrossSize = crossSize.dividedBy(2)

  return {
    ...pocketCluster,
    pocketCount: pocketCount.toNumber(),
    pocketStep: pocketStep.toNumber(),
    tPocketTabWidth: clamp(pocketCluster.tPocketTabWidth, 0, halfCrossSize).toNumber(),
    tPocketTaper: clamp(pocketCluster.tPocketTaper, 0, halfCrossSize).toNumber(),
  }
}
