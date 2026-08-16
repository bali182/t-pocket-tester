import BigNumber from 'bignumber.js'

import type {
  MagicFixEndpointMinimumEdgeDistanceIssueSchema,
  MagicFixIssueDetectorInput,
} from '../../../schemas/magicFixIssues'
import { isDefined } from '../../../utils/isDefined'
import { getPointDistance } from '../../geometryUtils'
import { getRayPathSegmentIntersections } from '../../pathSegmentIntersections'
import { getOrientedRouteEndpoints, type OrientedRouteEndpoint } from './utils/getOrientedRouteEndpoints'
import {
  getPhysicalBoundaryElements,
  type PhysicalBoundaryElement,
  type PhysicalBoundaryFragment,
} from './utils/getPhysicalBoundaryFragments'
import { getRouteContainedPhysicalElements } from './utils/getRouteContainedPhysicalElements'
import { isClosedRoute } from './utils/getSharpRouteCorners'

export const getEndpointMinimumEdgeDistanceIssues = (
  input: MagicFixIssueDetectorInput,
): MagicFixEndpointMinimumEdgeDistanceIssueSchema[] => {
  const physicalElements = getPhysicalBoundaryElements(input.computed)
  const accuracy = new BigNumber(input.config.accuracy)
  const issues: MagicFixEndpointMinimumEdgeDistanceIssueSchema[] = []

  for (const computedStitchLine of input.computed.stitchLines) {
    if (computedStitchLine.targetType === 'hole') {
      continue
    }

    for (const [routeIndex, route] of computedStitchLine.routes.entries()) {
      if (isClosedRoute(route)) {
        continue
      }

      const endpoints = getOrientedRouteEndpoints(route)
      const firstHole = route.holes[0]
      const lastHole = route.holes[route.holes.length - 1]

      if (!isDefined(endpoints) || !isDefined(firstHole) || !isDefined(lastHole)) {
        continue
      }

      const containedElements = getRouteContainedPhysicalElements(route, physicalElements)
      issues.push(
        ...getEndpointIssues(
          input,
          computedStitchLine.stitchLineId,
          routeIndex,
          'start',
          endpoints.start,
          firstHole.center,
          containedElements,
          accuracy,
        ),
        ...getEndpointIssues(
          input,
          computedStitchLine.stitchLineId,
          routeIndex,
          'end',
          endpoints.end,
          lastHole.center,
          containedElements,
          accuracy,
        ),
      )
    }
  }

  return issues
}

const getEndpointIssues = (
  input: MagicFixIssueDetectorInput,
  stitchLineId: string,
  routeIndex: number,
  endpoint: 'start' | 'end',
  routeEndpoint: OrientedRouteEndpoint,
  holeCenter: OrientedRouteEndpoint['position'],
  elements: PhysicalBoundaryElement[],
  accuracy: BigNumber,
): MagicFixEndpointMinimumEdgeDistanceIssueSchema[] => {
  return elements.flatMap((element) => {
    const intersections = getFirstBoundaryIntersections(routeEndpoint, element)

    return intersections.flatMap(({ fragment, point }) => {
      const componentConfig = input.config.componentConfigs[fragment.boundary.owner.componentId]

      if (!isDefined(componentConfig)) {
        return []
      }

      const minimumDistance = new BigNumber(componentConfig.preferredMinimumDistanceFromEdge)
      const actualDistance = getPointDistance(holeCenter, point)

      if (!actualDistance.isLessThan(minimumDistance.minus(accuracy))) {
        return []
      }

      return [
        {
          type: 'endpoint-minimum-edge-distance',
          route: { stitchLineId, routeIndex },
          endpoint,
          boundary: fragment.boundary,
          deviation: {
            minimumDistance,
            actualDistance,
            deviation: minimumDistance.minus(actualDistance),
          },
        },
      ]
    })
  })
}

type BoundaryIntersection = {
  fragment: PhysicalBoundaryFragment
  point: OrientedRouteEndpoint['position']
  rayProgress: BigNumber
}

const getFirstBoundaryIntersections = (
  endpoint: OrientedRouteEndpoint,
  element: PhysicalBoundaryElement,
): BoundaryIntersection[] => {
  const intersections = element.fragments.flatMap((fragment): BoundaryIntersection[] =>
    getRayPathSegmentIntersections(endpoint.position, endpoint.outwardDirection, fragment.segment).map(
      (intersection) => ({
        fragment,
        point: intersection.point,
        rayProgress: intersection.rayProgress,
      }),
    ),
  )
  const firstIntersection = intersections.reduce<BoundaryIntersection | undefined>(
    (first, candidate) =>
      !isDefined(first) || candidate.rayProgress.isLessThan(first.rayProgress) ? candidate : first,
    undefined,
  )

  return isDefined(firstIntersection)
    ? intersections.filter((intersection) => intersection.rayProgress.isEqualTo(firstIntersection.rayProgress))
    : []
}
