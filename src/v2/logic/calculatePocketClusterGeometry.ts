import type { PocketClusterSchema } from '../schemas/components'
import type { ComputedTPocketSchema, ComputedTopPocketSchema } from '../schemas/computed'
import type { CornerRadiusSchema, RectSchema } from '../schemas/geometry'
import { initial } from '../utils/initial'
import { last } from '../utils/last'
import { calculatePocketBoundingBox } from './calculatePocketBoundingBox'
import { calculateRectPath } from './calculateRectPath'
import { calculateTPocketPath } from './calculateTPocketPath'
import { getNormalizedCornerRadius } from './getNormalizedCornerRadius'
import { normalizePocketCluster } from './normalizePocketCluster'

export type PocketClusterGeometry = {
  frontPocket: ComputedTopPocketSchema
  tPockets: ComputedTPocketSchema[]
}

// Only the first T-pocket has exposed corners; the remaining pockets are fully covered by the pockets above them.
const zeroCornerRadius = {
  topLeft: 0,
  topRight: 0,
  bottomRight: 0,
  bottomLeft: 0,
}

export const calculatePocketClusterGeometry = (
  pocketCluster: PocketClusterSchema,
  rect: RectSchema,
): PocketClusterGeometry => {
  const normalizedPocketCluster = normalizePocketCluster(pocketCluster, rect)
  const cornerRadius = getNormalizedCornerRadius(normalizedPocketCluster)
  const pocketRects = calculatePocketBoundingBoxes(normalizedPocketCluster, rect)
  const topPocketRect = last(pocketRects)

  if (!topPocketRect) {
    throw new Error('Pocket cluster must contain at least one pocket')
  }

  return {
    frontPocket: {
      type: 'computed-top-pocket',
      id: `${pocketCluster.id}-top-pocket`,
      boundingRect: topPocketRect,
      path: calculateRectPath(topPocketRect, calculateTopPocketRadius(normalizedPocketCluster)),
    },
    tPockets: initial(pocketRects).map((pocketRect, index) => ({
      type: 'computed-t-pocket',
      id: `${pocketCluster.id}-t-pocket-${index}`,
      boundingRect: pocketRect,
      path: calculateTPocketPath(pocketRect, normalizedPocketCluster, index === 0 ? cornerRadius : zeroCornerRadius),
    })),
  }
}

const calculatePocketBoundingBoxes = (pocketCluster: PocketClusterSchema, rect: RectSchema): RectSchema[] => {
  return Array.from({ length: pocketCluster.pocketCount }, (_, index) =>
    calculatePocketBoundingBox(pocketCluster, rect, index),
  )
}

const calculateTopPocketRadius = (pocketCluster: PocketClusterSchema): CornerRadiusSchema => {
  const clusterRadius = getNormalizedCornerRadius(pocketCluster)

  switch (pocketCluster.orientation) {
    case 'up':
      return {
        topLeft: 0,
        topRight: 0,
        bottomRight: clusterRadius.bottomRight,
        bottomLeft: clusterRadius.bottomLeft,
      }
    case 'down':
      return {
        topLeft: clusterRadius.topLeft,
        topRight: clusterRadius.topRight,
        bottomRight: 0,
        bottomLeft: 0,
      }
    case 'left':
      return {
        topLeft: 0,
        topRight: clusterRadius.topRight,
        bottomRight: clusterRadius.bottomRight,
        bottomLeft: 0,
      }
    case 'right':
      return {
        topLeft: clusterRadius.topLeft,
        topRight: 0,
        bottomRight: 0,
        bottomLeft: clusterRadius.bottomLeft,
      }
  }
}
