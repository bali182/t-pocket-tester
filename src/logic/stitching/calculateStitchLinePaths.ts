import BigNumber from 'bignumber.js'

import { ZERO } from '../../constants/layout'
import type { PathCommand, PathSchema, PointSchema } from '../../schemas/geometry'
import type {
  ResolvedComponentBoundsStitchLineSchema,
  StitchCornerSchema,
  StitchSideSchema,
} from '../../schemas/stitching'
import { arePointsEqual } from '../../utils/arePointsEqual'
import { isDefined } from '../../utils/isDefined'
import { ComponentBoundsStitchLineTarget } from './helperTypes'

export type StitchSidePathFragment = {
  type: 'side'
  side: StitchSideSchema
  start: PointSchema
  end: PointSchema
}

export type StitchCornerPathFragment = {
  type: 'corner'
  corner: StitchCornerSchema
  start: PointSchema
  end: PointSchema
  radius: BigNumber
}

export type StitchPathFragment = StitchSidePathFragment | StitchCornerPathFragment

export type CalculatedStitchLinePath = {
  path: PathSchema
  fragments: StitchPathFragment[]
  isClosed: boolean
}

type SelectableStitchPathFragment = StitchPathFragment & {
  isSelected: boolean
}

export const calculateStitchLinePaths = (
  stitchLine: ResolvedComponentBoundsStitchLineSchema,
  target: ComponentBoundsStitchLineTarget,
): CalculatedStitchLinePath[] => {
  const fragments = calculateStitchLinePathFragments(stitchLine, target)

  return groupStitchLinePathFragments(fragments)
    .map((routeFragments) => ({
      path: createPathFromFragments(routeFragments),
      fragments: routeFragments,
      isClosed: arePointsEqual(routeFragments[0].start, routeFragments[routeFragments.length - 1].end),
    }))
    .filter((calculatedPath) => calculatedPath.path.commands.length > 1)
}

const calculateStitchLinePathFragments = (
  stitchLine: ResolvedComponentBoundsStitchLineSchema,
  target: ComponentBoundsStitchLineTarget,
): SelectableStitchPathFragment[] => {
  const margin = new BigNumber(stitchLine.stitchMargin)
  const boundingRect = getStitchLineBoundingRect(target, margin, stitchLine.targetType)
  const topLeftRadius = getStitchCornerRadius(target.cornerRadius.topLeft, margin, stitchLine.targetType)
  const topRightRadius = getStitchCornerRadius(target.cornerRadius.topRight, margin, stitchLine.targetType)
  const bottomRightRadius = getStitchCornerRadius(target.cornerRadius.bottomRight, margin, stitchLine.targetType)
  const bottomLeftRadius = getStitchCornerRadius(target.cornerRadius.bottomLeft, margin, stitchLine.targetType)
  const left = boundingRect.x
  const top = boundingRect.y
  const right = boundingRect.x.plus(boundingRect.width)
  const bottom = boundingRect.y.plus(boundingRect.height)
  const topLeftCorner = stitchLine.topLeftCorner && (stitchLine.top || stitchLine.left)
  const topRightCorner = stitchLine.topRightCorner && (stitchLine.top || stitchLine.right)
  const bottomRightCorner = stitchLine.bottomRightCorner && (stitchLine.right || stitchLine.bottom)
  const bottomLeftCorner = stitchLine.bottomLeftCorner && (stitchLine.bottom || stitchLine.left)

  return [
    {
      type: 'side',
      side: 'top',
      isSelected: stitchLine.top,
      start: {
        x: left.plus(topLeftRadius).minus(topLeftCorner ? ZERO : stitchLine.topStartOffset),
        y: top,
      },
      end: {
        x: right.minus(topRightRadius).plus(topRightCorner ? ZERO : stitchLine.topEndOffset),
        y: top,
      },
    },
    {
      type: 'corner',
      corner: 'top-right',
      isSelected: topRightCorner,
      radius: topRightRadius,
      start: {
        x: right.minus(topRightRadius),
        y: top,
      },
      end: {
        x: right,
        y: top.plus(topRightRadius),
      },
    },
    {
      type: 'side',
      side: 'right',
      isSelected: stitchLine.right,
      start: {
        x: right,
        y: top.plus(topRightRadius).minus(topRightCorner ? ZERO : stitchLine.rightStartOffset),
      },
      end: {
        x: right,
        y: bottom.minus(bottomRightRadius).plus(bottomRightCorner ? ZERO : stitchLine.rightEndOffset),
      },
    },
    {
      type: 'corner',
      corner: 'bottom-right',
      isSelected: bottomRightCorner,
      radius: bottomRightRadius,
      start: {
        x: right,
        y: bottom.minus(bottomRightRadius),
      },
      end: {
        x: right.minus(bottomRightRadius),
        y: bottom,
      },
    },
    {
      type: 'side',
      side: 'bottom',
      isSelected: stitchLine.bottom,
      start: {
        x: right.minus(bottomRightRadius).plus(bottomRightCorner ? ZERO : stitchLine.bottomStartOffset),
        y: bottom,
      },
      end: {
        x: left.plus(bottomLeftRadius).minus(bottomLeftCorner ? ZERO : stitchLine.bottomEndOffset),
        y: bottom,
      },
    },
    {
      type: 'corner',
      corner: 'bottom-left',
      isSelected: bottomLeftCorner,
      radius: bottomLeftRadius,
      start: {
        x: left.plus(bottomLeftRadius),
        y: bottom,
      },
      end: {
        x: left,
        y: bottom.minus(bottomLeftRadius),
      },
    },
    {
      type: 'side',
      side: 'left',
      isSelected: stitchLine.left,
      start: {
        x: left,
        y: bottom.minus(bottomLeftRadius).plus(bottomLeftCorner ? ZERO : stitchLine.leftStartOffset),
      },
      end: {
        x: left,
        y: top.plus(topLeftRadius).minus(topLeftCorner ? ZERO : stitchLine.leftEndOffset),
      },
    },
    {
      type: 'corner',
      corner: 'top-left',
      isSelected: topLeftCorner,
      radius: topLeftRadius,
      start: {
        x: left,
        y: top.plus(topLeftRadius),
      },
      end: {
        x: left.plus(topLeftRadius),
        y: top,
      },
    },
  ]
}

const getStitchLineBoundingRect = (
  target: ComponentBoundsStitchLineTarget,
  margin: BigNumber,
  targetType: ResolvedComponentBoundsStitchLineSchema['targetType'],
): ComponentBoundsStitchLineTarget['boundingRect'] => {
  switch (targetType) {
    case 'component':
      return {
        x: target.boundingRect.x.plus(margin),
        y: target.boundingRect.y.plus(margin),
        width: target.boundingRect.width.minus(margin.times(2)),
        height: target.boundingRect.height.minus(margin.times(2)),
      }
    case 'hole':
      return {
        x: target.boundingRect.x.minus(margin),
        y: target.boundingRect.y.minus(margin),
        width: target.boundingRect.width.plus(margin.times(2)),
        height: target.boundingRect.height.plus(margin.times(2)),
      }
  }
}

const getStitchCornerRadius = (
  cornerRadius: BigNumber,
  margin: BigNumber,
  targetType: ResolvedComponentBoundsStitchLineSchema['targetType'],
): BigNumber => {
  switch (targetType) {
    case 'component':
      return BigNumber.maximum(cornerRadius.minus(margin), ZERO)
    case 'hole':
      return cornerRadius.isZero() ? ZERO : cornerRadius.plus(margin)
  }
}

const groupStitchLinePathFragments = (fragments: SelectableStitchPathFragment[]): StitchPathFragment[][] => {
  const firstUnselectedFragmentIndex = fragments.findIndex((fragment) => !fragment.isSelected)
  const orderedFragments =
    firstUnselectedFragmentIndex === -1
      ? fragments
      : [...fragments.slice(firstUnselectedFragmentIndex + 1), ...fragments.slice(0, firstUnselectedFragmentIndex + 1)]
  const routes: StitchPathFragment[][] = []
  let currentRoute: StitchPathFragment[] | undefined

  for (const fragment of orderedFragments) {
    if (!fragment.isSelected) {
      currentRoute = undefined
      continue
    }

    if (!isDefined(currentRoute)) {
      currentRoute = []
      routes.push(currentRoute)
    }

    currentRoute.push(fragment)
  }

  return routes
}

const createPathFromFragments = (fragments: StitchPathFragment[]): PathSchema => {
  const commands: PathCommand[] = [{ type: 'moveTo', point: fragments[0].start }]

  for (const fragment of fragments) {
    if (fragment.type === 'side') {
      commands.push({ type: 'lineTo', point: fragment.end })
      continue
    }

    if (fragment.radius.isGreaterThan(ZERO)) {
      commands.push({ type: 'arcTo', radius: fragment.radius, point: fragment.end, reversed: false })
    }
  }

  return { commands }
}
