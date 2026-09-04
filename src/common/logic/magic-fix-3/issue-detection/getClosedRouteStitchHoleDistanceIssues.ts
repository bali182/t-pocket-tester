import BigNumber from 'bignumber.js'

import { nanoid } from 'nanoid'
import {
  MagicFixClosedRouteStitchHoleDistanceIssueSchema,
  MagicFixIssueDetectorInput,
} from '../../../schemas/magic-fix-3/magicFixIssues3'
import { accessors } from '../../../utils/accessors'
import { getResolvedStitchLine } from '../../../utils/getResolvedStitchLine'
import { isDefined } from '../../../utils/isDefined'
import { getPointDistance } from '../../geometryUtils'
import { getSharpRouteCorners, isClosedRoute } from './utils/getSharpRouteCorners'

export const getClosedRouteStitchHoleDistanceIssues = (
  input: MagicFixIssueDetectorInput,
): MagicFixClosedRouteStitchHoleDistanceIssueSchema[] => {
  const issues: MagicFixClosedRouteStitchHoleDistanceIssueSchema[] = []
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
      id: nanoid(),
      type: 'closed-route-stitch-hole-distance',
      route: { stitchLineId: computedStitchLine.stitchLineId, routeIndex },
      deviation: {
        expectedDistance: stitchHoleDistance,
        actualDistance,
        deviation,
      },
    })
  }

  return issues
}
