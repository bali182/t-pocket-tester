import BigNumber from 'bignumber.js'

import { PointSchema } from '../../schemas/geometry'
import type { StitchHoleSchema, StitchLineSchema } from '../../schemas/stitching'
import type { CalculatedStitchLinePath, StitchPathFragment, StitchSidePathFragment } from './calculateStitchLinePaths'
import {
  createStitchHoleSegments,
  findNextStitchHole,
  getSegmentTangentRotation,
  getStitchHoleRotation,
  type StitchHoleSegment,
} from './stitchHoleGeometry'

const MINIMUM_STITCH_HOLE_ENDPOINT_DISTANCE_FACTOR = new BigNumber(0.5)

type StitchHoleTraversal = {
  segments: StitchHoleSegment[]
  startsAt: PointSchema
  endsAt: PointSchema
  endsAtSharpCorner: boolean
}

export const calculateStitchLineHoles = (
  stitchLine: StitchLineSchema,
  calculatedPath: CalculatedStitchLinePath,
): StitchHoleSchema[] => {
  const stitchHoleDistance = new BigNumber(stitchLine.stitchHoleDistance)

  if (!stitchHoleDistance.isGreaterThan(0)) {
    return []
  }

  const traversals = calculateStitchHoleTraversals(stitchLine, calculatedPath.fragments)
  const holes = traversals.flatMap((traversal) => {
    const traversalHoles = calculateTraversalHoles(traversal, stitchHoleDistance)

    return traversal.endsAtSharpCorner
      ? removeHoleTooCloseToEndpoint(traversalHoles, traversal.endsAt, stitchHoleDistance)
      : traversalHoles
  })

  return calculatedPath.isClosed && !hasSharpCorner(calculatedPath.fragments)
    ? removeHoleTooCloseToRouteStart(holes, calculatedPath.fragments[0].start, stitchHoleDistance)
    : holes
}

const calculateStitchHoleTraversals = (
  stitchLine: StitchLineSchema,
  fragments: StitchPathFragment[],
): StitchHoleTraversal[] => {
  const orientedFragments = orientFragments(stitchLine, fragments)
  const traversals: StitchHoleTraversal[] = []
  let currentFragments: StitchPathFragment[] = []

  for (const fragment of orientedFragments) {
    if (isSharpCorner(fragment)) {
      appendTraversal(traversals, currentFragments, true, fragment.start)
      currentFragments = []
      continue
    }

    currentFragments.push(fragment)
  }

  const finalFragment = orientedFragments[orientedFragments.length - 1]
  const finalEndpoint = isDefined(finalFragment) ? finalFragment.end : undefined
  if (isDefined(finalEndpoint)) {
    appendTraversal(traversals, currentFragments, false, finalEndpoint)
  }

  return traversals
}

const orientFragments = (stitchLine: StitchLineSchema, fragments: StitchPathFragment[]): StitchPathFragment[] => {
  if (fragments.some((fragment) => fragment.type === 'corner')) {
    return fragments
  }

  const side = fragments[0]
  if (side.type !== 'side' || isCanonicalDirection(stitchLine, side)) {
    return fragments
  }

  return [reverseSideFragment(side)]
}

const isCanonicalDirection = (stitchLine: StitchLineSchema, side: StitchSidePathFragment): boolean => {
  switch (side.side) {
    case 'top':
      return stitchLine.topStitchDirection === 'left-to-right'
    case 'right':
      return stitchLine.rightStitchDirection === 'top-to-bottom'
    case 'bottom':
      return stitchLine.bottomStitchDirection === 'right-to-left'
    case 'left':
      return stitchLine.leftStitchDirection === 'bottom-to-top'
  }
}

const reverseSideFragment = (side: StitchSidePathFragment): StitchSidePathFragment => {
  return { ...side, start: side.end, end: side.start }
}

const appendTraversal = (
  traversals: StitchHoleTraversal[],
  fragments: StitchPathFragment[],
  endsAtSharpCorner: boolean,
  endsAt: PointSchema,
): void => {
  const segments = createStitchHoleSegments(fragments)
  const firstSegment = segments[0]

  if (!isDefined(firstSegment)) {
    return
  }

  traversals.push({
    segments,
    startsAt: firstSegment.start,
    endsAt,
    endsAtSharpCorner,
  })
}

const calculateTraversalHoles = (traversal: StitchHoleTraversal, stitchHoleDistance: BigNumber): StitchHoleSchema[] => {
  const firstSegment = traversal.segments[0]
  if (!isDefined(firstSegment)) {
    return []
  }

  const holes: StitchHoleSchema[] = [
    {
      center: traversal.startsAt,
      rotation: getSegmentTangentRotation(firstSegment, traversal.startsAt),
    },
  ]
  let previousHole = holes[0]
  let cursor = { segmentIndex: 0, point: traversal.startsAt }
  let nextHole = findNextStitchHole(previousHole.center, stitchHoleDistance, traversal.segments, cursor)

  while (isDefined(nextHole)) {
    const hole: StitchHoleSchema = {
      center: nextHole.center,
      rotation: getStitchHoleRotation(previousHole.center, nextHole.center),
    }
    holes.push(hole)
    previousHole = hole
    cursor = nextHole.cursor
    nextHole = findNextStitchHole(previousHole.center, stitchHoleDistance, traversal.segments, cursor)
  }

  return holes
}

const removeHoleTooCloseToEndpoint = (
  holes: StitchHoleSchema[],
  endpoint: PointSchema,
  stitchHoleDistance: BigNumber,
): StitchHoleSchema[] => {
  const lastHole = holes[holes.length - 1]

  if (!isDefined(lastHole) || !isHoleTooCloseToEndpoint(lastHole.center, endpoint, stitchHoleDistance)) {
    return holes
  }

  return holes.slice(0, -1)
}

const removeHoleTooCloseToRouteStart = (
  holes: StitchHoleSchema[],
  routeStart: PointSchema,
  stitchHoleDistance: BigNumber,
): StitchHoleSchema[] => {
  let result = holes
  let lastHole = result[result.length - 1]

  while (
    result.length > 1 &&
    isDefined(lastHole) &&
    isHoleTooCloseToEndpoint(lastHole.center, routeStart, stitchHoleDistance)
  ) {
    result = result.slice(0, -1)
    lastHole = result[result.length - 1]
  }

  return result
}

const isHoleTooCloseToEndpoint = (
  holeCenter: PointSchema,
  endpoint: PointSchema,
  stitchHoleDistance: BigNumber,
): boolean => {
  const minimumDistance = stitchHoleDistance.times(MINIMUM_STITCH_HOLE_ENDPOINT_DISTANCE_FACTOR)
  return getPointDistance(holeCenter, endpoint).isLessThanOrEqualTo(minimumDistance)
}

const getPointDistance = (first: PointSchema, second: PointSchema): BigNumber => {
  const deltaX = first.x.minus(second.x)
  const deltaY = first.y.minus(second.y)
  return deltaX.times(deltaX).plus(deltaY.times(deltaY)).sqrt()
}

const isSharpCorner = (fragment: StitchPathFragment): boolean => {
  return fragment.type === 'corner' && fragment.radius.isZero()
}

const hasSharpCorner = (fragments: StitchPathFragment[]): boolean => {
  return fragments.some(isSharpCorner)
}

const isDefined = <T>(value: T | undefined): value is T => {
  return value !== undefined
}
