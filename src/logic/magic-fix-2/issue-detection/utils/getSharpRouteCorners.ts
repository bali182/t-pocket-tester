import type { ComputedStitchRouteSchema } from '../../../../schemas/computed'
import type { PointSchema } from '../../../../schemas/geometry'
import type { StitchCornerSchema } from '../../../../schemas/stitching'
import { arePointsEqual } from '../../../../utils/arePointsEqual'
import { isDefined } from '../../../../utils/isDefined'
import { getPathSegments } from '../../../pathSegments'
import type { LinePathSegment } from '../../../pathSegmentTypes'

export type SharpRouteCorner = {
  corner: StitchCornerSchema
  position: PointSchema
}

export const getSharpRouteCorners = (route: ComputedStitchRouteSchema): SharpRouteCorner[] => {
  const pathSegments = getPathSegments(route.path)
  const sharpCorners = pathSegments.flatMap((previousSegment, index): SharpRouteCorner[] => {
    const nextSegment = pathSegments[index + 1]

    if (previousSegment.type !== 'line' || !isDefined(nextSegment) || nextSegment.type !== 'line') {
      return []
    }

    const corner = getSharpRouteCorner(previousSegment, nextSegment)
    return isDefined(corner) ? [corner] : []
  })

  const firstSegment = pathSegments[0]
  const lastSegment = pathSegments[pathSegments.length - 1]

  if (
    !isDefined(firstSegment) ||
    !isDefined(lastSegment) ||
    firstSegment.type !== 'line' ||
    lastSegment.type !== 'line' ||
    !arePointsEqual(lastSegment.end, firstSegment.start)
  ) {
    return sharpCorners
  }

  const closingCorner = getSharpRouteCorner(lastSegment, firstSegment)
  return isDefined(closingCorner) ? [...sharpCorners, closingCorner] : sharpCorners
}

export const isClosedRoute = (route: ComputedStitchRouteSchema): boolean => {
  const pathSegments = getPathSegments(route.path)
  const firstSegment = pathSegments[0]
  const lastSegment = pathSegments[pathSegments.length - 1]

  return isDefined(firstSegment) && isDefined(lastSegment) && arePointsEqual(lastSegment.end, firstSegment.start)
}

const getSharpRouteCorner = (previous: LinePathSegment, next: LinePathSegment): SharpRouteCorner | undefined => {
  if (!arePointsEqual(previous.end, next.start)) {
    return undefined
  }

  const previousX = previous.end.x.minus(previous.start.x)
  const previousY = previous.end.y.minus(previous.start.y)
  const nextX = next.end.x.minus(next.start.x)
  const nextY = next.end.y.minus(next.start.y)

  if ((previousX.isZero() && previousY.isZero()) || (nextX.isZero() && nextY.isZero())) {
    return undefined
  }

  if (!previousX.times(nextX).plus(previousY.times(nextY)).isZero()) {
    return undefined
  }

  const corner = getStitchCorner(previousX, previousY, nextX, nextY)
  return isDefined(corner) ? { corner, position: previous.end } : undefined
}

const getStitchCorner = (
  previousX: PointSchema['x'],
  previousY: PointSchema['y'],
  nextX: PointSchema['x'],
  nextY: PointSchema['y'],
): StitchCornerSchema | undefined => {
  if (previousX.isGreaterThan(0) && previousY.isZero() && nextX.isZero() && nextY.isGreaterThan(0)) {
    return 'top-right'
  }

  if (previousX.isZero() && previousY.isGreaterThan(0) && nextX.isLessThan(0) && nextY.isZero()) {
    return 'bottom-right'
  }

  if (previousX.isLessThan(0) && previousY.isZero() && nextX.isZero() && nextY.isLessThan(0)) {
    return 'bottom-left'
  }

  if (previousX.isZero() && previousY.isLessThan(0) && nextX.isGreaterThan(0) && nextY.isZero()) {
    return 'top-left'
  }

  return undefined
}
