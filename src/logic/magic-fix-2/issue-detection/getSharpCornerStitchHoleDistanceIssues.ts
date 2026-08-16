import BigNumber from 'bignumber.js'

import type { ComputedStitchRouteSchema } from '../../../schemas/computed'
import type { PointSchema } from '../../../schemas/geometry'
import type { MagicFixSharpCornerStitchHoleDistanceIssueSchema } from '../../../schemas/magicFixIssues'
import type { StitchCornerSchema } from '../../../schemas/stitching'
import { arePointsEqual } from '../../../utils/arePointsEqual'
import { getResolvedStitchLine } from '../../../utils/getResolvedStitchLine'
import { isDefined } from '../../../utils/isDefined'
import type { MagicFixIssueDetectorInput } from './types'

type LineSegment = {
  start: PointSchema
  end: PointSchema
  commandIndex: number
}

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
  const lineSegments = getLineSegments(route)
  const sharpCorners = lineSegments.flatMap((lineSegment, index): SharpCorner[] => {
    const nextLineSegment = lineSegments[index + 1]

    if (!isDefined(nextLineSegment) || nextLineSegment.commandIndex !== lineSegment.commandIndex + 1) {
      return []
    }

    const corner = getSharpCorner(lineSegment, nextLineSegment)
    return isDefined(corner) ? [corner] : []
  })

  const firstLineSegment = lineSegments[0]
  const lastLineSegment = lineSegments[lineSegments.length - 1]

  if (
    !isDefined(firstLineSegment) ||
    !isDefined(lastLineSegment) ||
    !arePointsEqual(lastLineSegment.end, firstLineSegment.start)
  ) {
    return sharpCorners
  }

  const closingCorner = getSharpCorner(lastLineSegment, firstLineSegment)
  return isDefined(closingCorner) ? [...sharpCorners, closingCorner] : sharpCorners
}

const getLineSegments = (route: ComputedStitchRouteSchema): LineSegment[] => {
  const segments: LineSegment[] = []
  let currentPoint: PointSchema | undefined

  for (const [commandIndex, command] of route.path.commands.entries()) {
    if (command.type === 'moveTo') {
      currentPoint = command.point
      continue
    }

    if (!isDefined(currentPoint)) {
      continue
    }

    if (command.type === 'lineTo') {
      segments.push({ start: currentPoint, end: command.point, commandIndex })
    }

    currentPoint = command.type === 'close' ? undefined : command.point
  }

  return segments
}

const getSharpCorner = (previous: LineSegment, next: LineSegment): SharpCorner | undefined => {
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

  const lineSegments = getLineSegments(route)
  const firstLineSegment = lineSegments[0]
  const lastLineSegment = lineSegments[lineSegments.length - 1]

  if (
    !isDefined(firstLineSegment) ||
    !isDefined(lastLineSegment) ||
    !arePointsEqual(lastLineSegment.end, firstLineSegment.start)
  ) {
    return undefined
  }

  return route.holes.length > 1 ? route.holes.length - 1 : undefined
}

const getPointDistance = (first: PointSchema, second: PointSchema): BigNumber => {
  const deltaX = first.x.minus(second.x)
  const deltaY = first.y.minus(second.y)
  return deltaX.times(deltaX).plus(deltaY.times(deltaY)).sqrt()
}
