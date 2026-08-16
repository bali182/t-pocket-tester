import BigNumber from 'bignumber.js'

import type { MagicFixRouteEndpointMissingStitchHoleIssueSchema } from '../../../schemas/magicFixIssues'
import { isDefined } from '../../../utils/isDefined'
import { getPointDistance } from '../../geometryUtils'
import type { MagicFixIssueDetectorInput } from './types'
import { getOrientedRouteEndpoints } from './utils/getOrientedRouteEndpoints'
import { isClosedRoute } from './utils/getSharpRouteCorners'

export const getRouteEndpointMissingStitchHoleIssues = (
  input: MagicFixIssueDetectorInput,
): MagicFixRouteEndpointMissingStitchHoleIssueSchema[] => {
  const issues: MagicFixRouteEndpointMissingStitchHoleIssueSchema[] = []
  const accuracy = new BigNumber(input.config.accuracy)

  for (const computedStitchLine of input.computed.stitchLines) {
    for (const [routeIndex, route] of computedStitchLine.routes.entries()) {
      const lastHole = route.holes[route.holes.length - 1]
      const endpoints = getOrientedRouteEndpoints(route)

      if (isClosedRoute(route) || !isDefined(lastHole) || !isDefined(endpoints)) {
        continue
      }

      const lastHoleDistanceToEndpoint = getPointDistance(lastHole.center, endpoints.end)

      if (!lastHoleDistanceToEndpoint.isGreaterThan(accuracy)) {
        continue
      }

      issues.push({
        type: 'route-endpoint-missing-stitch-hole',
        route: { stitchLineId: computedStitchLine.stitchLineId, routeIndex },
        endpointPosition: endpoints.end,
        lastHoleDistanceToEndpoint,
      })
    }
  }

  return issues
}
