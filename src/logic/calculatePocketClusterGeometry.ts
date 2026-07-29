import BigNumber from 'bignumber.js'

import type { PocketClusterSchema } from '../schemas/components'
import type { ComputedTPocketSchema, ComputedTopPocketSchema } from '../schemas/computed'
import type { CornerRadiusSchema, RectSchema } from '../schemas/geometry'
import type {
  ResolvedComponentBoundsStitchLineSchema,
  ResolvedPocketClusterStitchLineSchema,
  ResolvedStitchLineSchema,
  StitchLineCommonConfigSchema,
} from '../schemas/stitching'
import { initial } from '../utils/initial'
import { last } from '../utils/last'
import { calculatePocketBoundingBox } from './calculatePocketBoundingBox'
import { calculatePocketCard } from './calculatePocketCard'
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

const ZERO = new BigNumber(0)

export const calculatePocketClusterGeometry = (
  pocketCluster: PocketClusterSchema,
  rect: RectSchema,
  resolvedStitchLines: ResolvedStitchLineSchema[],
): PocketClusterGeometry => {
  const normalizedPocketCluster = normalizePocketCluster(pocketCluster, rect)
  const cornerRadius = getNormalizedCornerRadius(normalizedPocketCluster)
  const pocketRects = calculatePocketBoundingBoxes(normalizedPocketCluster, rect)
  const topPocketRect = last(pocketRects)

  if (!topPocketRect) {
    throw new Error('Pocket cluster must contain at least one pocket')
  }

  const topPocketCardBoundingRect = getPocketCardBoundingRect(
    normalizedPocketCluster,
    topPocketRect,
    resolvedStitchLines,
    false,
  )

  return {
    frontPocket: {
      type: 'computed-top-pocket',
      id: `${pocketCluster.id}-top-pocket`,
      boundingRect: topPocketRect,
      path: calculateRectPath(topPocketRect, calculateTopPocketRadius(normalizedPocketCluster)),
      card: calculatePocketCard(normalizedPocketCluster, topPocketCardBoundingRect),
    },
    tPockets: initial(pocketRects).map((pocketRect, index) => {
      const cardBoundingRect = getPocketCardBoundingRect(
        normalizedPocketCluster,
        pocketRect,
        resolvedStitchLines,
        true,
      )

      return {
        type: 'computed-t-pocket',
        id: `${pocketCluster.id}-t-pocket-${index}`,
        boundingRect: pocketRect,
        path: calculateTPocketPath(pocketRect, normalizedPocketCluster, index === 0 ? cornerRadius : zeroCornerRadius),
        card: calculatePocketCard(normalizedPocketCluster, cardBoundingRect),
      }
    }),
  }
}

const getPocketCardBoundingRect = (
  pocketCluster: PocketClusterSchema,
  pocketBoundingRect: RectSchema,
  resolvedStitchLines: ResolvedStitchLineSchema[],
  isTPocket: boolean,
): RectSchema => {
  const componentBoundsStitchLines = resolvedStitchLines.filter(
    (stitchLine): stitchLine is ResolvedComponentBoundsStitchLineSchema => {
      if (stitchLine.type !== 'component-bounds-stitch-line') {
        return false
      }
      if (stitchLine.targetType === 'hole') {
        throw new Error('Hole stitch line targets are not supported yet')
      }

      return stitchLine.targetId === pocketCluster.id
    },
  )
  const pocketClusterStitchLines = resolvedStitchLines.filter(
    (stitchLine): stitchLine is ResolvedPocketClusterStitchLineSchema =>
      stitchLine.type === 'pocket-cluster-stitch-line' && stitchLine.targetId === pocketCluster.id && stitchLine.enabled,
  )
  const leftInset = getMaximumStitchClearance(componentBoundsStitchLines.filter((stitchLine) => stitchLine.left))
  const rightInset = getMaximumStitchClearance(componentBoundsStitchLines.filter((stitchLine) => stitchLine.right))
  const topInset = getMaximumStitchClearance(componentBoundsStitchLines.filter((stitchLine) => stitchLine.top))
  const bottomInset = getMaximumStitchClearance(componentBoundsStitchLines.filter((stitchLine) => stitchLine.bottom))
  const pocketClusterStitchInset = isTPocket
    ? getMaximumStitchClearance(pocketClusterStitchLines)
    : ZERO

  let left = pocketBoundingRect.x
  let top = pocketBoundingRect.y
  let right = left.plus(pocketBoundingRect.width)
  let bottom = top.plus(pocketBoundingRect.height)

  switch (pocketCluster.orientation) {
    case 'up':
      left = left.plus(leftInset)
      right = right.minus(rightInset)
      bottom = bottom.minus(isTPocket ? pocketClusterStitchInset : bottomInset)
      break
    case 'down':
      left = left.plus(leftInset)
      right = right.minus(rightInset)
      top = top.plus(isTPocket ? pocketClusterStitchInset : topInset)
      break
    case 'left':
      top = top.plus(topInset)
      bottom = bottom.minus(bottomInset)
      right = right.minus(isTPocket ? pocketClusterStitchInset : rightInset)
      break
    case 'right':
      top = top.plus(topInset)
      bottom = bottom.minus(bottomInset)
      left = left.plus(isTPocket ? pocketClusterStitchInset : leftInset)
      break
  }

  return {
    x: left,
    y: top,
    width: right.minus(left),
    height: bottom.minus(top),
  }
}

const getMaximumStitchClearance = (stitchLines: StitchLineCommonConfigSchema[]): BigNumber => {
  return stitchLines.reduce(
    (maximumClearance, stitchLine) => BigNumber.maximum(maximumClearance, getStitchClearance(stitchLine)),
    ZERO,
  )
}

const getStitchClearance = (stitchLine: StitchLineCommonConfigSchema): BigNumber => {
  return new BigNumber(stitchLine.stitchMargin).plus(new BigNumber(stitchLine.stitchHoleLength).dividedBy(2 * Math.sqrt(2)))
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
