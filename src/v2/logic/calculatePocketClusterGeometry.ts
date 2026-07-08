import type { CornerRadius, PocketClusterSchema } from '../schemas/components'
import type { ComputedTPocket, ComputedTopPocket } from '../schemas/computed'
import type { RectSchema } from '../schemas/geometry'
import { initial } from '../utils/initial'
import { last } from '../utils/last'
import { calculatePocketBoundingBox } from './calculatePocketBoundingBox'
import { calculateRectPath } from './calculateRectPath'
import { calculateTPocketPath } from './calculateTPocketPath'
import { getNormalizedCornerRadius } from './getNormalizedCornerRadius'
import { normalizePocketCluster } from './normalizePocketCluster'

export type PocketClusterGeometry = {
  frontPocket: ComputedTopPocket
  tPockets: ComputedTPocket[]
}

const calculatePocketBoundingBoxes = (pocketCluster: PocketClusterSchema, rect: RectSchema): RectSchema[] => {
  return Array.from({ length: pocketCluster.pocketCount }, (_, index) =>
    calculatePocketBoundingBox(pocketCluster, rect, index),
  )
}

const calculateTopPocketRadius = (pocketCluster: PocketClusterSchema): CornerRadius => {
  const clusterRadius = getNormalizedCornerRadius(pocketCluster.radius)
  const pocketRadius = pocketCluster.pocketRadius

  switch (pocketCluster.orientation) {
    case 'up':
      return {
        topLeft: pocketRadius,
        topRight: pocketRadius,
        bottomRight: clusterRadius.bottomRight,
        bottomLeft: clusterRadius.bottomLeft,
      }
    case 'down':
      return {
        topLeft: clusterRadius.topLeft,
        topRight: clusterRadius.topRight,
        bottomRight: pocketRadius,
        bottomLeft: pocketRadius,
      }
    case 'left':
      return {
        topLeft: pocketRadius,
        topRight: clusterRadius.topRight,
        bottomRight: clusterRadius.bottomRight,
        bottomLeft: pocketRadius,
      }
    case 'right':
      return {
        topLeft: clusterRadius.topLeft,
        topRight: pocketRadius,
        bottomRight: pocketRadius,
        bottomLeft: clusterRadius.bottomLeft,
      }
  }
}

export const calculatePocketClusterGeometry = (
  pocketCluster: PocketClusterSchema,
  rect: RectSchema,
): PocketClusterGeometry => {
  const normalizedPocketCluster = normalizePocketCluster(pocketCluster, rect)
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
      path: calculateTPocketPath(pocketRect, normalizedPocketCluster),
    })),
  }
}
