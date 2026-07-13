import BigNumber from 'bignumber.js'

import type { ComponentSchema } from '../schemas/components'
import type { ComputedComponentSchema } from '../schemas/computed'
import type { PathCommand, PathSchema, PointSchema } from '../schemas/geometry'
import type { StitchLineSchema } from '../schemas/stitching'
import { last } from '../utils/last'
import { getNormalizedCornerRadius } from './getNormalizedCornerRadius'

const ZERO = new BigNumber(0)

type StitchSidePathFragment = {
  type: 'side'
  start: PointSchema
  end: PointSchema
}

type StitchCornerPathFragment = {
  type: 'corner'
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

  const fragments: StitchPathFragment[] = []

  if (stitchLine.top) {
    fragments.push({
      type: 'side',
      start: { x: left.plus(topLeftRadius).plus(topStartOffset), y: top },
      end: { x: right.minus(topRightRadius).minus(topEndOffset), y: top },
    })
  }

  if (stitchLine.topRightCorner && topRightRadius.isGreaterThan(ZERO)) {
    fragments.push({
      type: 'corner',
      radius: topRightRadius,
      start: { x: right.minus(topRightRadius), y: top },
      end: { x: right, y: top.plus(topRightRadius) },
    })
  }

  if (stitchLine.right) {
    fragments.push({
      type: 'side',
      start: { x: right, y: top.plus(topRightRadius).plus(rightStartOffset) },
      end: { x: right, y: bottom.minus(bottomRightRadius).minus(rightEndOffset) },
    })
  }

  if (stitchLine.bottomRightCorner && bottomRightRadius.isGreaterThan(ZERO)) {
    fragments.push({
      type: 'corner',
      radius: bottomRightRadius,
      start: { x: right, y: bottom.minus(bottomRightRadius) },
      end: { x: right.minus(bottomRightRadius), y: bottom },
    })
  }

  if (stitchLine.bottom) {
    fragments.push({
      type: 'side',
      start: { x: right.minus(bottomRightRadius).minus(bottomStartOffset), y: bottom },
      end: { x: left.plus(bottomLeftRadius).plus(bottomEndOffset), y: bottom },
    })
  }

  if (stitchLine.bottomLeftCorner && bottomLeftRadius.isGreaterThan(ZERO)) {
    fragments.push({
      type: 'corner',
      radius: bottomLeftRadius,
      start: { x: left.plus(bottomLeftRadius), y: bottom },
      end: { x: left, y: bottom.minus(bottomLeftRadius) },
    })
  }

  if (stitchLine.left) {
    fragments.push({
      type: 'side',
      start: { x: left, y: bottom.minus(bottomLeftRadius).minus(leftStartOffset) },
      end: { x: left, y: top.plus(topLeftRadius).plus(leftEndOffset) },
    })
  }

  if (stitchLine.topLeftCorner && topLeftRadius.isGreaterThan(ZERO)) {
    fragments.push({
      type: 'corner',
      radius: topLeftRadius,
      start: { x: left, y: top.plus(topLeftRadius) },
      end: { x: left.plus(topLeftRadius), y: top },
    })
  }

  return calculatePaths(fragments)
}

const getInnerCornerRadius = (cornerRadius: number, margin: BigNumber): BigNumber => {
  return BigNumber.maximum(new BigNumber(cornerRadius).minus(margin), ZERO)
}

const calculatePaths = (fragments: StitchPathFragment[]): PathSchema[] => {
  const paths: PathSchema[] = []
  let currentPath: PathSchema | undefined
  let currentPathEnd: PointSchema | undefined

  for (const fragment of fragments) {
    if (!isDefined(currentPath) || !isDefined(currentPathEnd) || !arePointsEqual(currentPathEnd, fragment.start)) {
      currentPath = {
        commands: [{ type: 'moveTo', point: fragment.start }],
      }
      paths.push(currentPath)
    }

    appendFragment(currentPath.commands, fragment)
    currentPathEnd = fragment.end
  }

  return mergeCircularPaths(paths)
}

const appendFragment = (commands: PathCommand[], fragment: StitchPathFragment): void => {
  switch (fragment.type) {
    case 'side':
      commands.push({ type: 'lineTo', point: fragment.end })
      return
    case 'corner':
      commands.push({ type: 'arcTo', radius: fragment.radius, point: fragment.end })
  }
}

const mergeCircularPaths = (paths: PathSchema[]): PathSchema[] => {
  const firstPath = paths[0]
  const lastPath = last(paths)

  if (!isDefined(firstPath) || !isDefined(lastPath) || firstPath === lastPath) {
    return paths
  }

  const firstPathStart = getPathStart(firstPath)
  const lastPathEnd = getPathEnd(lastPath)

  if (!arePointsEqual(lastPathEnd, firstPathStart)) {
    return paths
  }

  return [{ commands: [...lastPath.commands, ...firstPath.commands.slice(1)] }, ...paths.slice(1, -1)]
}

const getPathStart = (path: PathSchema): PointSchema => {
  const firstCommand = path.commands[0]

  if (!isDefined(firstCommand) || firstCommand.type !== 'moveTo') {
    throw new Error('Stitch path must start with moveTo')
  }

  return firstCommand.point
}

const getPathEnd = (path: PathSchema): PointSchema => {
  const lastCommand = last(path.commands)

  if (!isDefined(lastCommand) || (lastCommand.type !== 'lineTo' && lastCommand.type !== 'arcTo')) {
    throw new Error('Stitch path must end with lineTo or arcTo')
  }

  return lastCommand.point
}

const arePointsEqual = (first: PointSchema, second: PointSchema): boolean => {
  return first.x.isEqualTo(second.x) && first.y.isEqualTo(second.y)
}

const isDefined = <T>(value: T | undefined): value is T => {
  return value !== undefined
}
