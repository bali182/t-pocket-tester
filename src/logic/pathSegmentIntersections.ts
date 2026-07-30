import BigNumber from 'bignumber.js'

import type { PointSchema } from '../schemas/geometry'
import type { ArcPathSegment, LinePathSegment, PathSegment, PathSegmentIntersection } from './pathSegmentTypes'
import {
  getAngle,
  getArcProgress,
  getPointOnPathSegment,
  getSortedDistinctProgresses,
  isProgressInRange,
} from './pathSegmentUtils'

const TWO = new BigNumber(2)

export const getPathSegmentIntersections = (first: PathSegment, second: PathSegment): PathSegmentIntersection[] => {
  if (first.type === 'line' && second.type === 'line') {
    return getLineLineIntersections(first, second)
  }

  if (first.type === 'line' && second.type === 'arc') {
    return getLineArcIntersections(first, second)
  }

  if (first.type === 'arc' && second.type === 'line') {
    return getLineArcIntersections(second, first).map((intersection) => ({
      firstProgress: intersection.secondProgress,
      secondProgress: intersection.firstProgress,
      point: intersection.point,
    }))
  }

  if (first.type === 'arc' && second.type === 'arc') {
    return getArcArcIntersections(first, second)
  }

  throw new Error('Unsupported path segment intersection')
}

const getLineLineIntersections = (first: LinePathSegment, second: LinePathSegment): PathSegmentIntersection[] => {
  const firstDx = first.end.x.minus(first.start.x)
  const firstDy = first.end.y.minus(first.start.y)
  const secondDx = second.end.x.minus(second.start.x)
  const secondDy = second.end.y.minus(second.start.y)
  const denominator = firstDx.times(secondDy).minus(firstDy.times(secondDx))

  if (denominator.isZero()) {
    return []
  }

  const startDx = second.start.x.minus(first.start.x)
  const startDy = second.start.y.minus(first.start.y)
  const firstProgress = startDx.times(secondDy).minus(startDy.times(secondDx)).dividedBy(denominator)
  const secondProgress = startDx.times(firstDy).minus(startDy.times(firstDx)).dividedBy(denominator)

  if (!isProgressInRange(firstProgress) || !isProgressInRange(secondProgress)) {
    return []
  }

  return [{ firstProgress, secondProgress, point: getPointOnPathSegment(first, firstProgress) }]
}

const getLineArcIntersections = (line: LinePathSegment, arc: ArcPathSegment): PathSegmentIntersection[] => {
  const dx = line.end.x.minus(line.start.x)
  const dy = line.end.y.minus(line.start.y)
  const fromCenterX = line.start.x.minus(arc.center.x)
  const fromCenterY = line.start.y.minus(arc.center.y)
  const a = dx.pow(2).plus(dy.pow(2))
  const b = TWO.times(fromCenterX.times(dx).plus(fromCenterY.times(dy)))
  const c = fromCenterX.pow(2).plus(fromCenterY.pow(2)).minus(arc.radius.pow(2))
  const discriminant = b.pow(2).minus(new BigNumber(4).times(a).times(c))

  if (discriminant.isNegative()) {
    return []
  }

  const discriminantRoot = discriminant.sqrt()
  const firstProgress = b.negated().minus(discriminantRoot).dividedBy(TWO.times(a))
  const secondProgress = b.negated().plus(discriminantRoot).dividedBy(TWO.times(a))

  return getSortedDistinctProgresses([firstProgress, secondProgress]).flatMap((lineProgress) => {
    if (!isProgressInRange(lineProgress)) {
      return []
    }

    const point = getPointOnPathSegment(line, lineProgress)
    const arcProgress = new BigNumber(getArcProgress(arc, getAngle(arc.center, point)))

    if (!isProgressInRange(arcProgress)) {
      return []
    }

    return [{ firstProgress: lineProgress, secondProgress: arcProgress, point }]
  })
}

const getArcArcIntersections = (first: ArcPathSegment, second: ArcPathSegment): PathSegmentIntersection[] => {
  const centerDx = second.center.x.minus(first.center.x)
  const centerDy = second.center.y.minus(first.center.y)
  const centerDistance = centerDx.pow(2).plus(centerDy.pow(2)).sqrt()

  if (centerDistance.isZero() || centerDistance.isGreaterThan(first.radius.plus(second.radius))) {
    return []
  }

  if (centerDistance.isLessThan(first.radius.minus(second.radius).abs())) {
    return []
  }

  const firstDistance = first.radius
    .pow(2)
    .minus(second.radius.pow(2))
    .plus(centerDistance.pow(2))
    .dividedBy(TWO.times(centerDistance))
  const heightSquared = first.radius.pow(2).minus(firstDistance.pow(2))

  if (heightSquared.isNegative()) {
    return []
  }

  const height = heightSquared.sqrt()
  const baseX = first.center.x.plus(centerDx.dividedBy(centerDistance).times(firstDistance))
  const baseY = first.center.y.plus(centerDy.dividedBy(centerDistance).times(firstDistance))
  const offsetX = centerDy.negated().dividedBy(centerDistance).times(height)
  const offsetY = centerDx.dividedBy(centerDistance).times(height)
  const firstPoint: PointSchema = { x: baseX.plus(offsetX), y: baseY.plus(offsetY) }
  const secondPoint: PointSchema = { x: baseX.minus(offsetX), y: baseY.minus(offsetY) }

  return [firstPoint, secondPoint].flatMap((point) => {
    const firstProgress = new BigNumber(getArcProgress(first, getAngle(first.center, point)))
    const secondProgress = new BigNumber(getArcProgress(second, getAngle(second.center, point)))

    if (!isProgressInRange(firstProgress) || !isProgressInRange(secondProgress)) {
      return []
    }

    return [{ firstProgress, secondProgress, point }]
  })
}
