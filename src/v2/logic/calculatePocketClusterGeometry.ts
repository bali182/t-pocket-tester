import { PolygonSchema } from '../../v1/schemas/PolygonSchema'
import type { PocketClusterSchema } from '../schemas/components'
import type { RectSchema } from '../schemas/geometry'
import { initial } from '../utils/initial'
import { last } from '../utils/last'
import { calculatePocketBoundingBox } from './calculatePocketBoundingBox'
import { calculateTPocketPolygon } from './calculateTPocketPolygon'
import { normalizePocketCluster } from './normalizePocketCluster'

export type PocketClusterGeometry = {
  tPocketPolygons: PolygonSchema[]
  topPocketRect: RectSchema
}

const calculatePocketBoundingBoxes = (pocketCluster: PocketClusterSchema, rect: RectSchema): RectSchema[] => {
  return Array.from({ length: pocketCluster.pocketCount }, (_, index) =>
    calculatePocketBoundingBox(pocketCluster, rect, index),
  )
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
    tPocketPolygons: initial(pocketRects).map((pocketRect) =>
      calculateTPocketPolygon(pocketRect, normalizedPocketCluster),
    ),
    topPocketRect,
  }
}
