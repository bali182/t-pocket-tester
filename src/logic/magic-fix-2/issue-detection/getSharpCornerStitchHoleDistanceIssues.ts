import BigNumber from 'bignumber.js'

import type { ComputedStitchRouteSchema } from '../../../schemas/computed'
import type { PointSchema } from '../../../schemas/geometry'
import type { MagicFixSharpCornerStitchHoleDistanceIssueSchema } from '../../../schemas/magicFixIssues'
import type { StitchCornerSchema } from '../../../schemas/stitching'
import { arePointsEqual } from '../../../utils/arePointsEqual'
import { getResolvedStitchLine } from '../../../utils/getResolvedStitchLine'
import { isDefined } from '../../../utils/isDefined'
import { getPointDistance } from '../../geometryUtils'
import { getPathSegments } from '../../pathSegments'
import type { LinePathSegment } from '../../pathSegmentTypes'
import type { MagicFixIssueDetectorInput } from './types'

type SharpCorner = {
  corner: StitchCornerSchema
  position: PointSchema
}

export const getSharpCornerStitchHoleDistanceIssues = (
  input: MagicFixIssueDetectorInput,
): MagicFixSharpCornerStitchHoleDistanceIssueSchema[] => {
  const issues: MagicFixSharpCornerStitchHoleDistanceIssueSchema[] = []

  for (const computedStitchLine of input.computed.stitchLines) {
    const stitchLine = input.subProject.stitchLines.find(({ id }) => id === computedStitchLine.stitchLineId)

    if (!isDefined(stitchLine) || stitchLine.type !== 'component-bounds-stitch-line') {
      continue
    }

    const stitchHoleDistance = new BigNumber(
      getResolvedStitchLine(stitchLine, input.project.stitchingSettings).stitchHoleDistance,
    )
    const accuracy = new BigNumber(input.config.accuracy)

    for (const [routeIndex, route] of computedStitchLine.routes.entries()) {
      for (const sharpCorner of getSharpCorners(route)) {
        const nextHoleIndex = route.holes.findIndex(({ center }) => arePointsEqual(center, sharpCorner.position))

        if (nextHoleIndex === -1) {
          continue
        }

        const previousHoleIndex = getPreviousHoleIndex(route, nextHoleIndex)

        if (!isDefined(previousHoleIndex)) {
          continue
        }

        const previousHole = route.holes[previousHoleIndex]
        const nextHole = route.holes[nextHoleIndex]

        if (!isDefined(previousHole) || !isDefined(nextHole)) {
          continue
        }

        const actualDistance = getPointDistance(previousHole.center, nextHole.center)
        const deviation = actualDistance.minus(stitchHoleDistance).absoluteValue()

        if (!deviation.isGreaterThan(accuracy)) {
          continue
        }

        issues.push({
          type: 'sharp-corner-stitch-hole-distance',
          route: { stitchLineId: computedStitchLine.stitchLineId, routeIndex },
          corner: sharpCorner.corner,
          previousHoleIndex,
          nextHoleIndex,
          deviation: {
            expectedDistance: stitchHoleDistance,
            actualDistance,
            deviation,
          },
        })
      }
    }
  }

  return issues
}

const getSharpCorners = (route: ComputedStitchRouteSchema): SharpCorner[] => {
  const pathSegments = getPathSegments(route.path)
  const sharpCorners = pathSegments.flatMap((previousSegment, index): SharpCorner[] => {
    const nextSegment = pathSegments[index + 1]

    if (previousSegment.type !== 'line' || !isDefined(nextSegment) || nextSegment.type !== 'line') {
      return []
    }

    const corner = getSharpCorner(previousSegment, nextSegment)
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

  const closingCorner = getSharpCorner(lastSegment, firstSegment)
  return isDefined(closingCorner) ? [...sharpCorners, closingCorner] : sharpCorners
}

const getSharpCorner = (previous: LinePathSegment, next: LinePathSegment): SharpCorner | undefined => {
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
  previousX: BigNumber,
  previousY: BigNumber,
  nextX: BigNumber,
  nextY: BigNumber,
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

const getPreviousHoleIndex = (route: ComputedStitchRouteSchema, nextHoleIndex: number): number | undefined => {
  if (nextHoleIndex > 0) {
    return nextHoleIndex - 1
  }

  const pathSegments = getPathSegments(route.path)
  const firstSegment = pathSegments[0]
  const lastSegment = pathSegments[pathSegments.length - 1]

  if (
    !isDefined(firstSegment) ||
    !isDefined(lastSegment) ||
    firstSegment.type !== 'line' ||
    lastSegment.type !== 'line' ||
    !arePointsEqual(lastSegment.end, firstSegment.start)
  ) {
    return undefined
  }

  return route.holes.length > 1 ? route.holes.length - 1 : undefined
}
