import BigNumber from 'bignumber.js'

import type { MagicFixClosedRouteStitchHoleDistanceIssueSchema } from '../../../schemas/magicFixIssues'
import { getResolvedStitchLine } from '../../../utils/getResolvedStitchLine'
import { isDefined } from '../../../utils/isDefined'
import { getPointDistance } from '../../geometryUtils'
import type { MagicFixIssueDetectorInput } from './types'
import { getSharpRouteCorners, isClosedRoute } from './utils/getSharpRouteCorners'

export const getClosedRouteStitchHoleDistanceIssues = (
  input: MagicFixIssueDetectorInput,
): MagicFixClosedRouteStitchHoleDistanceIssueSchema[] => {
  const issues: MagicFixClosedRouteStitchHoleDistanceIssueSchema[] = []

  for (const computedStitchLine of input.computed.stitchLines) {
    const stitchLine = input.subProject.stitchLines.find(({ id }) => id === computedStitchLine.stitchLineId)

    if (!isDefined(stitchLine)) {
      continue
    }

    const stitchHoleDistance = new BigNumber(
      getResolvedStitchLine(stitchLine, input.project.stitchingSettings).stitchHoleDistance,
    )
    const accuracy = new BigNumber(input.config.accuracy)

    for (const [routeIndex, route] of computedStitchLine.routes.entries()) {
      const firstHole = route.holes[0]
      const lastHole = route.holes[route.holes.length - 1]

      if (
        !isClosedRoute(route) ||
        getSharpRouteCorners(route).length > 0 ||
        !isDefined(firstHole) ||
        !isDefined(lastHole)
      ) {
        continue
      }

      const actualDistance = getPointDistance(firstHole.center, lastHole.center)
      const deviation = actualDistance.minus(stitchHoleDistance).absoluteValue()

      if (!deviation.isGreaterThan(accuracy)) {
        continue
      }

      issues.push({
        type: 'closed-route-stitch-hole-distance',
        route: { stitchLineId: computedStitchLine.stitchLineId, routeIndex },
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
