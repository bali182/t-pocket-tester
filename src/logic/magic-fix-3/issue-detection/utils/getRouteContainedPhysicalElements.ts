import type { ComputedStitchRouteSchema } from '../../../../schemas/computed'
import { isPointInClosedPath } from '../../../isPointInClosedPath'
import { getPathSegmentIntersections } from '../../../pathSegmentIntersections'
import { getPathSegments } from '../../../pathSegments'
import { getPathSegmentMidpoint } from '../../../pathSegmentUtils'
import type { PhysicalBoundaryElement } from './getPhysicalBoundaryFragments'

export const getRouteContainedPhysicalElements = (
  route: ComputedStitchRouteSchema,
  elements: PhysicalBoundaryElement[],
): PhysicalBoundaryElement[] => {
  const routeSegments = getPathSegments(route.path)

  return elements.filter((element) =>
    routeSegments.every(
      (routeSegment) =>
        isPointInClosedPath(getPathSegmentMidpoint(routeSegment), element.path) &&
        element.fragments.every((fragment) => getPathSegmentIntersections(routeSegment, fragment.segment).length === 0),
    ),
  )
}
