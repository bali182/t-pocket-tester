import type { PathCommand, PathSchema, PointSchema } from '../schemas/geometry'
import { arePointsEqual } from '../utils/arePointsEqual'
import { isDefined } from '../utils/isDefined'
import type { PathSegment } from './pathSegmentTypes'
import { createArcPathSegment } from './pathSegmentUtils'

export const getPathSegments = (path: PathSchema, requireClosed = false): PathSegment[] => {
  const segments: PathSegment[] = []
  let currentPoint: PointSchema | undefined
  let subpathStart: PointSchema | undefined
  let hasClose = false

  for (const command of path.commands) {
    if (command.type === 'moveTo') {
      currentPoint = command.point
      subpathStart = command.point
      continue
    }

    if (command.type === 'close') {
      if (!isDefined(currentPoint) || !isDefined(subpathStart)) {
        throw new Error('Path close command has no subpath start')
      }

      addLineSegment(segments, currentPoint, subpathStart)
      currentPoint = subpathStart
      hasClose = true
      continue
    }

    if (!isDefined(currentPoint)) {
      throw new Error(`Path ${command.type} command has no start point`)
    }

    if (command.type === 'lineTo') {
      addLineSegment(segments, currentPoint, command.point)
      currentPoint = command.point
      continue
    }

    segments.push(createArcPathSegment(currentPoint, command))
    currentPoint = command.point
  }

  if (requireClosed && !hasClose) {
    throw new Error('Clipping path must be closed')
  }

  return segments
}

export const createPathsFromConnectedSegments = (segments: PathSegment[]): PathSchema[] => {
  const paths: PathSchema[] = []
  let currentSegments: PathSegment[] = []

  for (const segment of segments) {
    const previousSegment = currentSegments[currentSegments.length - 1]

    if (isDefined(previousSegment) && !arePointsEqual(previousSegment.end, segment.start)) {
      paths.push(createPathFromConnectedSegments(currentSegments))
      currentSegments = []
    }

    currentSegments.push(segment)
  }

  if (currentSegments.length > 0) {
    paths.push(createPathFromConnectedSegments(currentSegments))
  }

  return paths
}

const addLineSegment = (segments: PathSegment[], start: PointSchema, end: PointSchema): void => {
  if (!arePointsEqual(start, end)) {
    segments.push({ type: 'line', start, end })
  }
}

export const createPathFromConnectedSegments = (segments: PathSegment[]): PathSchema => {
  const commands: PathCommand[] = [{ type: 'moveTo', point: segments[0].start }]

  for (const segment of segments) {
    if (segment.type === 'line') {
      commands.push({ type: 'lineTo', point: segment.end })
      continue
    }

    commands.push({ type: 'arcTo', radius: segment.radius, point: segment.end })
  }

  return { commands }
}
