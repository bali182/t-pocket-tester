import BigNumber from 'bignumber.js'

import type { ComponentSchema } from '../schemas/components'
import type { ComputedComponentSchema } from '../schemas/computed'
import type { PathCommand, PathSchema, PointSchema } from '../schemas/geometry'
import type { StitchLineSchema } from '../schemas/stitching'
import { getNormalizedCornerRadius } from './getNormalizedCornerRadius'

const ZERO = new BigNumber(0)

type StitchSidePathFragment = {
  type: 'side'
  isSelected: boolean
  start: PointSchema
  end: PointSchema
}

type StitchCornerPathFragment = {
  type: 'corner'
  isSelected: boolean
  start: PointSchema
  end: PointSchema
  radius: BigNumber
}

type StitchPathFragment = StitchSidePathFragment | StitchCornerPathFragment

export const calculateStitchLinePaths = (
  stitchLine: StitchLineSchema,
  component: ComponentSchema,
  computedComponent: ComputedComponentSchema,
): PathSchema[] => {
  const { boundingRect } = computedComponent
  const margin = new BigNumber(stitchLine.stitchMargin)
  const cornerRadius = getNormalizedCornerRadius(component)
  const topLeftRadius = getInnerCornerRadius(cornerRadius.topLeft, margin)
  const topRightRadius = getInnerCornerRadius(cornerRadius.topRight, margin)
  const bottomRightRadius = getInnerCornerRadius(cornerRadius.bottomRight, margin)
  const bottomLeftRadius = getInnerCornerRadius(cornerRadius.bottomLeft, margin)
  const left = boundingRect.x.plus(margin)
  const top = boundingRect.y.plus(margin)
  const right = boundingRect.x.plus(boundingRect.width).minus(margin)
  const bottom = boundingRect.y.plus(boundingRect.height).minus(margin)
  const topStartOffset = new BigNumber(stitchLine.topStartOffset)
  const topEndOffset = new BigNumber(stitchLine.topEndOffset)
  const rightStartOffset = new BigNumber(stitchLine.rightStartOffset)
  const rightEndOffset = new BigNumber(stitchLine.rightEndOffset)
  const bottomStartOffset = new BigNumber(stitchLine.bottomStartOffset)
  const bottomEndOffset = new BigNumber(stitchLine.bottomEndOffset)
  const leftStartOffset = new BigNumber(stitchLine.leftStartOffset)
  const leftEndOffset = new BigNumber(stitchLine.leftEndOffset)

  const fragments: StitchPathFragment[] = [
    {
      type: 'side',
      isSelected: stitchLine.top,
      start: { x: left.plus(topLeftRadius).minus(topStartOffset), y: top },
      end: { x: right.minus(topRightRadius).plus(topEndOffset), y: top },
    },
    {
      type: 'corner',
      isSelected: stitchLine.topRightCorner,
      radius: topRightRadius,
      start: { x: right.minus(topRightRadius), y: top },
      end: { x: right, y: top.plus(topRightRadius) },
    },
    {
      type: 'side',
      isSelected: stitchLine.right,
      start: { x: right, y: top.plus(topRightRadius).minus(rightStartOffset) },
      end: { x: right, y: bottom.minus(bottomRightRadius).plus(rightEndOffset) },
    },
    {
      type: 'corner',
      isSelected: stitchLine.bottomRightCorner,
      radius: bottomRightRadius,
      start: { x: right, y: bottom.minus(bottomRightRadius) },
      end: { x: right.minus(bottomRightRadius), y: bottom },
    },
    {
      type: 'side',
      isSelected: stitchLine.bottom,
      start: { x: right.minus(bottomRightRadius).plus(bottomStartOffset), y: bottom },
      end: { x: left.plus(bottomLeftRadius).minus(bottomEndOffset), y: bottom },
    },
    {
      type: 'corner',
      isSelected: stitchLine.bottomLeftCorner,
      radius: bottomLeftRadius,
      start: { x: left.plus(bottomLeftRadius), y: bottom },
      end: { x: left, y: bottom.minus(bottomLeftRadius) },
    },
    {
      type: 'side',
      isSelected: stitchLine.left,
      start: { x: left, y: bottom.minus(bottomLeftRadius).plus(leftStartOffset) },
      end: { x: left, y: top.plus(topLeftRadius).minus(leftEndOffset) },
    },
    {
      type: 'corner',
      isSelected: stitchLine.topLeftCorner,
      radius: topLeftRadius,
      start: { x: left, y: top.plus(topLeftRadius) },
      end: { x: left.plus(topLeftRadius), y: top },
    },
  ]

  return calculatePaths(fragments)
}

const getInnerCornerRadius = (cornerRadius: number, margin: BigNumber): BigNumber => {
  return BigNumber.maximum(new BigNumber(cornerRadius).minus(margin), ZERO)
}

const calculatePaths = (fragments: StitchPathFragment[]): PathSchema[] => {
  const firstUnselectedFragmentIndex = fragments.findIndex((fragment) => !fragment.isSelected)
  const orderedFragments =
    firstUnselectedFragmentIndex === -1
      ? fragments
      : [...fragments.slice(firstUnselectedFragmentIndex + 1), ...fragments.slice(0, firstUnselectedFragmentIndex + 1)]
  const paths: PathSchema[] = []
  let currentPath: PathSchema | undefined
  let currentPathEnd: PointSchema | undefined

  for (const fragment of orderedFragments) {
    if (!fragment.isSelected) {
      currentPath = undefined
      currentPathEnd = undefined
      continue
    }

    if (!isDefined(currentPath) || !isDefined(currentPathEnd) || !arePointsEqual(currentPathEnd, fragment.start)) {
      currentPath = {
        commands: [{ type: 'moveTo', point: fragment.start }],
      }
      paths.push(currentPath)
    }

    appendFragment(currentPath.commands, fragment)
    currentPathEnd = fragment.end
  }

  return paths.filter((path) => path.commands.length > 1)
}

const appendFragment = (commands: PathCommand[], fragment: StitchPathFragment): void => {
  switch (fragment.type) {
    case 'side':
      commands.push({ type: 'lineTo', point: fragment.end })
      return
    case 'corner':
      if (fragment.radius.isGreaterThan(ZERO)) {
        commands.push({ type: 'arcTo', radius: fragment.radius, point: fragment.end })
      }
      return
  }
}

const arePointsEqual = (first: PointSchema, second: PointSchema): boolean => {
  return first.x.isEqualTo(second.x) && first.y.isEqualTo(second.y)
}

const isDefined = <T>(value: T | undefined): value is T => {
  return value !== undefined
}
