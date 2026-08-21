import BigNumber from 'bignumber.js'

import { ZERO, ZERO_CORNER_RADIUS } from '../constants/layout'
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

export type PocketClusterGeometry = {
  frontPocket: ComputedTopPocketSchema
  tPockets: ComputedTPocketSchema[]
}

export const calculatePocketClusterGeometry = (
  pocketCluster: PocketClusterSchema,
  rect: RectSchema,
  radius: CornerRadiusSchema,
  resolvedStitchLines: ResolvedStitchLineSchema[],
): PocketClusterGeometry => {
  const pocketRects = calculatePocketBoundingBoxes(pocketCluster, rect)
  const topPocketRect = last(pocketRects)

  if (!topPocketRect) {
    throw new Error('Pocket cluster must contain at least one pocket')
  }

  const topPocketCardBoundingRect = getPocketCardBoundingRect(pocketCluster, topPocketRect, resolvedStitchLines, false)
  const topPocketRadius = calculateTopPocketRadius(pocketCluster, radius)
  const frontPocketPath = calculateRectPath(topPocketRect, topPocketRadius)

  return {
    frontPocket: {
      type: 'computed-top-pocket',
      id: `${pocketCluster.id}-top-pocket`,
      componentId: pocketCluster.id,
      boundingRect: topPocketRect,
      path: frontPocketPath,
      uncutPath: frontPocketPath,
      cornerRadius: topPocketRadius,
      card: calculatePocketCard(pocketCluster, topPocketCardBoundingRect),
    },
    tPockets: initial(pocketRects).map((pocketRect, index): ComputedTPocketSchema => {
      const cardBoundingRect = getPocketCardBoundingRect(pocketCluster, pocketRect, resolvedStitchLines, true)
      const cornerRadius = index === 0 ? radius : ZERO_CORNER_RADIUS
      const path = calculateTPocketPath(pocketRect, pocketCluster, cornerRadius)

      return {
        type: 'computed-t-pocket',
        componentId: pocketCluster.id,
        id: `${pocketCluster.id}-t-pocket-${index}`,
        boundingRect: pocketRect,
        cornerRadius,
        path,
        uncutPath: path,
        card: calculatePocketCard(pocketCluster, cardBoundingRect),
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
      return stitchLine.targetType === 'component' && stitchLine.targetId === pocketCluster.id
    },
  )
  const pocketClusterStitchLines = resolvedStitchLines.filter(
    (stitchLine): stitchLine is ResolvedPocketClusterStitchLineSchema =>
      stitchLine.type === 'pocket-cluster-stitch-line' && stitchLine.targetId === pocketCluster.id,
  )
  const leftInset = getMaximumStitchClearance(componentBoundsStitchLines.filter((stitchLine) => stitchLine.left))
  const rightInset = getMaximumStitchClearance(componentBoundsStitchLines.filter((stitchLine) => stitchLine.right))
  const topInset = getMaximumStitchClearance(componentBoundsStitchLines.filter((stitchLine) => stitchLine.top))
  const bottomInset = getMaximumStitchClearance(componentBoundsStitchLines.filter((stitchLine) => stitchLine.bottom))
  const pocketClusterStitchInset = isTPocket ? getMaximumStitchClearance(pocketClusterStitchLines) : ZERO

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
  return new BigNumber(stitchLine.stitchMargin).plus(
    new BigNumber(stitchLine.stitchHoleLength).dividedBy(2 * Math.sqrt(2)),
  )
}

const calculatePocketBoundingBoxes = (pocketCluster: PocketClusterSchema, rect: RectSchema): RectSchema[] => {
  return Array.from({ length: pocketCluster.pocketCount }, (_, index) =>
    calculatePocketBoundingBox(pocketCluster, rect, index),
  )
}

const calculateTopPocketRadius = (
  pocketCluster: PocketClusterSchema,
  radius: CornerRadiusSchema,
): CornerRadiusSchema => {
  switch (pocketCluster.orientation) {
    case 'up':
      return {
        topLeft: ZERO,
        topRight: ZERO,
        bottomRight: radius.bottomRight,
        bottomLeft: radius.bottomLeft,
      }
    case 'down':
      return {
        topLeft: radius.topLeft,
        topRight: radius.topRight,
        bottomRight: ZERO,
        bottomLeft: ZERO,
      }
    case 'left':
      return {
        topLeft: ZERO,
        topRight: radius.topRight,
        bottomRight: radius.bottomRight,
        bottomLeft: ZERO,
      }
    case 'right':
      return {
        topLeft: radius.topLeft,
        topRight: ZERO,
        bottomRight: ZERO,
        bottomLeft: radius.bottomLeft,
      }
  }
}
