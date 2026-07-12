import { PocketClusterSchema } from '../schemas/components'
import { RectSchema } from '../schemas/geometry'
import { clamp } from '../utils/clamp'

export const normalizePocketCluster = (pocketCluster: PocketClusterSchema, rect: RectSchema): PocketClusterSchema => {
  const pocketCount = Math.max(Math.floor(pocketCluster.pocketCount), 1)
  const tPocketCount = pocketCount - 1
  const isVertical = pocketCluster.orientation === 'up' || pocketCluster.orientation === 'down'
  const stackLength = isVertical ? rect.height : rect.width
  const crossSize = isVertical ? rect.width : rect.height
  const pocketStep = clamp(pocketCluster.pocketStep, 0, stackLength / Math.max(tPocketCount, 1)).toNumber()
  const halfCrossSize = crossSize / 2

  return {
    ...pocketCluster,
    pocketCount,
    pocketStep,
    tPocketTabWidth: clamp(pocketCluster.tPocketTabWidth, 0, halfCrossSize).toNumber(),
    tPocketTaper: clamp(pocketCluster.tPocketTaper, 0, halfCrossSize).toNumber(),
  }
}
