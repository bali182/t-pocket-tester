import type { ComputedStitchRouteSchema } from '../../../../schemas/computed'
import type { PointSchema } from '../../../../schemas/geometry'
import { arePointsEqual } from '../../../../utils/arePointsEqual'
import { isDefined } from '../../../../utils/isDefined'
import { getPathSegments } from '../../../pathSegments'

export type OrientedRouteEndpoints = {
  start: PointSchema
  end: PointSchema
}

export const getOrientedRouteEndpoints = (route: ComputedStitchRouteSchema): OrientedRouteEndpoints | undefined => {
  const firstHole = route.holes[0]
  const pathSegments = getPathSegments(route.path)
  const firstSegment = pathSegments[0]
  const lastSegment = pathSegments[pathSegments.length - 1]

  if (!isDefined(firstHole) || !isDefined(firstSegment) || !isDefined(lastSegment)) {
    return undefined
  }

  if (arePointsEqual(firstHole.center, firstSegment.start)) {
    return { start: firstSegment.start, end: lastSegment.end }
  }

  if (arePointsEqual(firstHole.center, lastSegment.end)) {
    return { start: lastSegment.end, end: firstSegment.start }
  }

  return undefined
}
