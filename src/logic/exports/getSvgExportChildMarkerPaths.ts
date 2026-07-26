import type { ComputedComponentSchema } from '../../schemas/computed'
import type { PathSchema, RectSchema } from '../../schemas/geometry'
import { createPathFromConnectedSegments, getPathSegments } from '../pathSegments'
import type { LinePathSegment } from '../pathSegmentTypes'
import { doLinePathSegmentsOverlap, isLinePathSegment } from '../pathSegmentUtils'

export const getSvgExportChildMarkerPaths = (
  children: ComputedComponentSchema[],
  parentPath: PathSchema,
): PathSchema[] => {
  const parentLineSegments = getPathSegments(parentPath).filter(isLinePathSegment)
  const boundingRects = children.flatMap((child) => {
    switch (child.type) {
      case 'computed-root-panel':
      case 'computed-panel':
        return [child.boundingRect]
      case 'computed-pocket-cluster':
        return [
          child.frontPocket.boundingRect,
          ...child.tPockets.map((pocket) => pocket.boundingRect),
        ]
    }
  })

  return boundingRects.flatMap((boundingRect) => {
    return getBoundingRectMarkerLines(boundingRect)
      .filter((markerLine) => !parentLineSegments.some((parentLine) => doLinePathSegmentsOverlap(markerLine, parentLine)))
      .map((markerLine) => createPathFromConnectedSegments([markerLine]))
  })
}

const getBoundingRectMarkerLines = (boundingRect: RectSchema): LinePathSegment[] => {
  const right = boundingRect.x.plus(boundingRect.width)
  const bottom = boundingRect.y.plus(boundingRect.height)
  const topLeft = { x: boundingRect.x, y: boundingRect.y }
  const topRight = { x: right, y: boundingRect.y }
  const bottomRight = { x: right, y: bottom }
  const bottomLeft = { x: boundingRect.x, y: bottom }

  return [
    { type: 'line', start: topLeft, end: topRight },
    { type: 'line', start: topRight, end: bottomRight },
    { type: 'line', start: bottomRight, end: bottomLeft },
    { type: 'line', start: bottomLeft, end: topLeft },
  ]
}
