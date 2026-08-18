import BigNumber from 'bignumber.js'
import { nanoid } from 'nanoid'

import type { ComputedStitchRouteSchema } from '../../../schemas/computed'
import type { PointSchema } from '../../../schemas/geometry'
import type {
  MagicFixCrossingHoleResultSchema,
  MagicFixEdgeCrossingMinimumStitchHoleDistanceIssueSchema,
  MagicFixIssueDetectorInput,
} from '../../../schemas/magic-fix-3/magicFixIssues3'
import { accessors } from '../../../utils/accessors'
import { arePointsEqual } from '../../../utils/arePointsEqual'
import { getResolvedStitchLine } from '../../../utils/getResolvedStitchLine'
import { isDefined } from '../../../utils/isDefined'
import { getPointDistance } from '../../geometryUtils'
import { getPathSegmentIntersections } from '../../pathSegmentIntersections'
import { getPathSegments } from '../../pathSegments'
import type { PathSegment, PathSegmentIntersection } from '../../pathSegmentTypes'
import { getAngle, getArcProgress, isPointOnPathSegment } from '../../pathSegmentUtils'
import {
  getPhysicalBoundaryElements,
  type PhysicalBoundaryElement,
  type PhysicalBoundaryFragment,
} from './utils/getPhysicalBoundaryFragments'

export const getEdgeCrossingMinimumStitchHoleDistanceIssues = (
  input: MagicFixIssueDetectorInput,
): MagicFixEdgeCrossingMinimumStitchHoleDistanceIssueSchema[] => {
  const physicalElements = getPhysicalBoundaryElements(input.computed)
  const accuracy = new BigNumber(input.magicFixSettings.accuracy)
  const issues: MagicFixEdgeCrossingMinimumStitchHoleDistanceIssueSchema[] = []
  const computedStitchLine = accessors.computedSubProject(input.computed).stitchLine(input.stitchLineId)

  // TODO: Support hole stitchlines once Magic Fix can configure and fix them.
  if (computedStitchLine.targetType === 'hole') {
    return []
  }
  const stitchLine = accessors.subProject(input.subProject).stitchLine(input.stitchLineId)
  const minimumDistance = new BigNumber(
    getResolvedStitchLine(stitchLine, input.stitchLineSettings).stitchHoleDistance,
  ).multipliedBy(input.magicFixSettings.minimumEdgeCrossingMultiplier)

  for (const [routeIndex, route] of computedStitchLine.routes.entries()) {
    for (const crossing of getRouteBoundaryIntersections(route, physicalElements)) {
      const crossingHoles = getRouteCrossingHoles(route, crossing.position)

      if (!isDefined(crossingHoles)) {
        continue
      }

      const beforeCrossing = getCrossingHoleResult(route, crossingHoles.before, crossing.point, minimumDistance)
      const afterCrossing = getCrossingHoleResult(route, crossingHoles.after, crossing.point, minimumDistance)

      if (
        !beforeCrossing.deviation.deviation.isGreaterThan(accuracy) &&
        !afterCrossing.deviation.deviation.isGreaterThan(accuracy)
      ) {
        continue
      }

      issues.push({
        id: nanoid(),
        type: 'edge-crossing-minimum-stitch-hole-distance',
        route: { stitchLineId: computedStitchLine.stitchLineId, routeIndex },
        boundary: crossing.boundary.boundary,
        beforeCrossing,
        afterCrossing,
      })
    }
  }

  return issues
}

type RouteSegmentPosition = {
  segmentIndex: number
  segmentProgress: BigNumber
}

type RouteHolePosition = RouteSegmentPosition & {
  holeIndex: number
}

type RouteCrossingHoles = {
  before: RouteHolePosition
  after: RouteHolePosition
}

type RouteBoundaryIntersection = {
  boundary: PhysicalBoundaryFragment
  point: PointSchema
  position: RouteSegmentPosition
}

const getRouteBoundaryIntersections = (
  route: ComputedStitchRouteSchema,
  elements: PhysicalBoundaryElement[],
): RouteBoundaryIntersection[] => {
  const routeSegments = getPathSegments(route.path)

  return routeSegments.flatMap((routeSegment, segmentIndex) =>
    elements.flatMap((element) =>
      element.fragments.flatMap((boundary) =>
        getPathSegmentIntersections(routeSegment, boundary.segment).map((intersection) =>
          createRouteBoundaryIntersection(boundary, segmentIndex, intersection),
        ),
      ),
    ),
  )
}

const createRouteBoundaryIntersection = (
  boundary: PhysicalBoundaryFragment,
  segmentIndex: number,
  intersection: PathSegmentIntersection,
): RouteBoundaryIntersection => ({
  boundary,
  point: intersection.point,
  position: { segmentIndex, segmentProgress: intersection.firstProgress },
})

const getRouteCrossingHoles = (
  route: ComputedStitchRouteSchema,
  crossingPosition: RouteSegmentPosition,
): RouteCrossingHoles | undefined => {
  const holePositions = getRouteHolePositions(route)
  const firstHolePosition = holePositions[0]
  const firstSegment = getPathSegments(route.path)[0]

  if (!isDefined(firstHolePosition) || !isDefined(firstSegment)) {
    return undefined
  }

  const orderedHolePositions = arePointsEqual(route.holes[firstHolePosition.holeIndex].center, firstSegment.start)
    ? holePositions
    : [...holePositions].reverse()
  const afterIndex = orderedHolePositions.findIndex((hole) => compareRoutePositions(hole, crossingPosition) > 0)

  if (afterIndex <= 0) {
    return undefined
  }

  const before = orderedHolePositions[afterIndex - 1]
  const after = orderedHolePositions[afterIndex]

  return isDefined(before) && isDefined(after) ? { before, after } : undefined
}

const getRouteHolePositions = (route: ComputedStitchRouteSchema): RouteHolePosition[] => {
  const routeSegments = getPathSegments(route.path)

  return route.holes.flatMap((hole, holeIndex): RouteHolePosition[] => {
    const segmentIndex = routeSegments.findIndex((segment) => isPointOnPathSegment(hole.center, segment))
    const segment = routeSegments[segmentIndex]

    if (!isDefined(segment)) {
      return []
    }

    return [{ holeIndex, segmentIndex, segmentProgress: getPathSegmentProgress(segment, hole.center) }]
  })
}

const getPathSegmentProgress = (segment: PathSegment, point: PointSchema): BigNumber => {
  if (segment.type === 'line') {
    const deltaX = segment.end.x.minus(segment.start.x)

    return !deltaX.isZero()
      ? point.x.minus(segment.start.x).dividedBy(deltaX)
      : point.y.minus(segment.start.y).dividedBy(segment.end.y.minus(segment.start.y))
  }

  return new BigNumber(getArcProgress(segment, getAngle(segment.center, point)))
}

const compareRoutePositions = (first: RouteSegmentPosition, second: RouteSegmentPosition): number => {
  if (first.segmentIndex !== second.segmentIndex) {
    return first.segmentIndex - second.segmentIndex
  }

  return first.segmentProgress.comparedTo(second.segmentProgress) ?? 0
}

const getCrossingHoleResult = (
  route: ComputedStitchRouteSchema,
  holePosition: RouteHolePosition,
  crossingPoint: PointSchema,
  minimumDistance: BigNumber,
): MagicFixCrossingHoleResultSchema => {
  const hole = route.holes[holePosition.holeIndex]

  if (!isDefined(hole)) {
    throw new Error(`Route hole not found: ${holePosition.holeIndex}`)
  }

  const actualDistance = getPointDistance(hole.center, crossingPoint)

  return {
    type: 'distance',
    holeIndex: holePosition.holeIndex,
    deviation: {
      minimumDistance,
      actualDistance,
      deviation: BigNumber.maximum(minimumDistance.minus(actualDistance), 0),
    },
  }
}
