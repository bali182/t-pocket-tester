import BigNumber from 'bignumber.js'

import type { ComputedStitchRouteSchema } from '../../../schemas/computed'
import type { MagicFixSharpCornerStitchHoleDistanceIssueSchema } from '../../../schemas/magicFixIssues'
import { arePointsEqual } from '../../../utils/arePointsEqual'
import { getResolvedStitchLine } from '../../../utils/getResolvedStitchLine'
import { isDefined } from '../../../utils/isDefined'
import { getPointDistance } from '../../geometryUtils'
import type { MagicFixIssueDetectorInput } from './types'
import { getSharpRouteCorners, isClosedRoute } from './utils/getSharpRouteCorners'

export const getSharpCornerStitchHoleDistanceIssues = (
  input: MagicFixIssueDetectorInput,
): MagicFixSharpCornerStitchHoleDistanceIssueSchema[] => {
  const issues: MagicFixSharpCornerStitchHoleDistanceIssueSchema[] = []

  for (const computedStitchLine of input.computed.stitchLines) {
    const stitchLine = input.subProject.stitchLines.find(({ id }) => id === computedStitchLine.stitchLineId)

    if (!isDefined(stitchLine) || stitchLine.type !== 'component-bounds-stitch-line') {
      continue
    }

    const stitchHoleDistance = new BigNumber(
      getResolvedStitchLine(stitchLine, input.project.stitchingSettings).stitchHoleDistance,
    )
    const accuracy = new BigNumber(input.config.accuracy)

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
