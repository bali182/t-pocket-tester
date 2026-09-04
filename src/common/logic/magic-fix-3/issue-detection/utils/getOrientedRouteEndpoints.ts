import type { ComputedStitchRouteSchema } from '../../../../schemas/computed'
import type { PointSchema } from '../../../../schemas/geometry'
import { arePointsEqual } from '../../../../utils/arePointsEqual'
import { isDefined } from '../../../../utils/isDefined'
import { getPathSegments } from '../../../pathSegments'
import { getPathSegmentTangent } from '../../../pathSegmentUtils'

export type OrientedRouteEndpoint = {
  position: PointSchema
  outwardDirection: PointSchema
}

export type OrientedRouteEndpoints = {
  start: OrientedRouteEndpoint
  end: OrientedRouteEndpoint
}

export const getOrientedRouteEndpoints = (route: ComputedStitchRouteSchema): OrientedRouteEndpoints | undefined => {
  const firstHole = route.holes[0]
  const pathSegments = getPathSegments(route.path)
  const firstSegment = pathSegments[0]
  const lastSegment = pathSegments[pathSegments.length - 1]

  if (!isDefined(firstHole) || !isDefined(firstSegment) || !isDefined(lastSegment)) {
    return undefined
  }

  const pathStart: OrientedRouteEndpoint = {
    position: firstSegment.start,
    outwardDirection: negateDirection(getPathSegmentTangent(firstSegment, firstSegment.start)),
  }
  const pathEnd: OrientedRouteEndpoint = {
    position: lastSegment.end,
    outwardDirection: getPathSegmentTangent(lastSegment, lastSegment.end),
  }

  if (arePointsEqual(firstHole.center, firstSegment.start)) {
    return { start: pathStart, end: pathEnd }
  }

  if (arePointsEqual(firstHole.center, lastSegment.end)) {
    return { start: pathEnd, end: pathStart }
  }

  return undefined
}

const negateDirection = (direction: PointSchema): PointSchema => ({
  x: direction.x.negated(),
  y: direction.y.negated(),
})
