import BigNumber from 'bignumber.js'
import { nanoid } from 'nanoid'

import type {
  MagicFixIssueDetectorInput,
  MagicFixRouteEndpointMissingStitchHoleIssueSchema,
} from '../../../schemas/magic-fix-3/magicFixIssues3'
import { accessors } from '../../../utils/accessors'
import { isDefined } from '../../../utils/isDefined'
import { getPointDistance } from '../../geometryUtils'
import { getOrientedRouteEndpoints } from './utils/getOrientedRouteEndpoints'
import { isClosedRoute } from './utils/getSharpRouteCorners'

export const getRouteEndpointMissingStitchHoleIssues = (
  input: MagicFixIssueDetectorInput,
): MagicFixRouteEndpointMissingStitchHoleIssueSchema[] => {
  const issues: MagicFixRouteEndpointMissingStitchHoleIssueSchema[] = []
  const accuracy = new BigNumber(input.magicFixSettings.accuracy)
  const computedStitchLine = accessors.computedSubProject(input.computed).stitchLine(input.stitchLineId)

  // TODO: Support hole stitchlines once Magic Fix can configure and fix them.
  if (computedStitchLine.targetType === 'hole') {
    return []
  }

  for (const [routeIndex, route] of computedStitchLine.routes.entries()) {
    const lastHole = route.holes[route.holes.length - 1]
    const endpoints = getOrientedRouteEndpoints(route)

    if (isClosedRoute(route) || !isDefined(lastHole) || !isDefined(endpoints)) {
      continue
    }

    const lastHoleDistanceToEndpoint = getPointDistance(lastHole.center, endpoints.end.position)

    if (!lastHoleDistanceToEndpoint.isGreaterThan(accuracy)) {
      continue
    }

    issues.push({
      id: nanoid(),
      type: 'route-endpoint-missing-stitch-hole',
      route: { stitchLineId: computedStitchLine.stitchLineId, routeIndex },
      endpointPosition: endpoints.end.position,
      lastHoleDistanceToEndpoint,
    })
  }

  return issues
}
