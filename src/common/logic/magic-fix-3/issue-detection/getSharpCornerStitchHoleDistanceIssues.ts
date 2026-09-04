import BigNumber from 'bignumber.js'

import { nanoid } from 'nanoid'
import type { ComputedStitchRouteSchema } from '../../../schemas/computed'
import {
  MagicFixIssueDetectorInput,
  MagicFixSharpCornerStitchHoleDistanceIssueSchema,
} from '../../../schemas/magic-fix-3/magicFixIssues3'
import { accessors } from '../../../utils/accessors'
import { arePointsEqual } from '../../../utils/arePointsEqual'
import { getResolvedStitchLine } from '../../../utils/getResolvedStitchLine'
import { isDefined } from '../../../utils/isDefined'
import { getPointDistance } from '../../geometryUtils'
import { getSharpRouteCorners, isClosedRoute } from './utils/getSharpRouteCorners'

export const getSharpCornerStitchHoleDistanceIssues = (
  input: MagicFixIssueDetectorInput,
): MagicFixSharpCornerStitchHoleDistanceIssueSchema[] => {
  const issues: MagicFixSharpCornerStitchHoleDistanceIssueSchema[] = []
  const computedStitchLine = accessors.computedSubProject(input.computed).stitchLine(input.stitchLineId)

  // TODO: Support hole stitchlines once Magic Fix can configure and fix them.
  if (computedStitchLine.targetType === 'hole') {
    return []
  }

  const stitchLine = accessors.subProject(input.subProject).stitchLine(input.stitchLineId)
  const stitchHoleDistance = new BigNumber(
    getResolvedStitchLine(stitchLine, input.stitchLineSettings).stitchHoleDistance,
  )
  const accuracy = new BigNumber(input.magicFixSettings.accuracy)

  for (const [routeIndex, route] of computedStitchLine.routes.entries()) {
    for (const sharpCorner of getSharpRouteCorners(route)) {
      const nextHoleIndex = route.holes.findIndex(({ center }) => arePointsEqual(center, sharpCorner.position))

      if (nextHoleIndex === -1) {
        continue
      }

      const previousHoleIndex = getPreviousHoleIndex(route, nextHoleIndex)

      if (!isDefined(previousHoleIndex)) {
        continue
      }

      const previousHole = route.holes[previousHoleIndex]
      const nextHole = route.holes[nextHoleIndex]

      if (!isDefined(previousHole) || !isDefined(nextHole)) {
        continue
      }

      const actualDistance = getPointDistance(previousHole.center, nextHole.center)
      const deviation = actualDistance.minus(stitchHoleDistance).absoluteValue()

      if (!deviation.isGreaterThan(accuracy)) {
        continue
      }

      issues.push({
        id: nanoid(),
        type: 'sharp-corner-stitch-hole-distance',
        route: { stitchLineId: computedStitchLine.stitchLineId, routeIndex },
        corner: sharpCorner.corner,
        previousHoleIndex,
        nextHoleIndex,
        deviation: {
          expectedDistance: stitchHoleDistance,
          actualDistance,
          deviation,
        },
      })
    }
  }

  return issues
}

const getPreviousHoleIndex = (route: ComputedStitchRouteSchema, nextHoleIndex: number): number | undefined => {
  if (nextHoleIndex > 0) {
    return nextHoleIndex - 1
  }

  if (!isClosedRoute(route)) {
    return undefined
  }

  return route.holes.length > 1 ? route.holes.length - 1 : undefined
}
