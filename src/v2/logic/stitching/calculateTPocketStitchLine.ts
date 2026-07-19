import BigNumber from 'bignumber.js'

import type { PocketClusterSchema } from '../../schemas/components'
import type { ComputedTPocketSchema } from '../../schemas/computed'
import type { LineSchema, PathSchema } from '../../schemas/geometry'
import type { PocketClusterStitchLineSchema } from '../../schemas/stitching'
import { clamp } from '../../utils/clamp'
import { getTPocketTabDepth } from '../pocketUtils'

export type CalculatedTPocketStitchLine = {
  line: LineSchema
  path: PathSchema
}

export const calculateTPocketStitchLine = (
  stitchLine: PocketClusterStitchLineSchema,
  normalizedPocketCluster: PocketClusterSchema,
  tPocket: ComputedTPocketSchema,
): CalculatedTPocketStitchLine => {
  const { boundingRect } = tPocket
  const left = boundingRect.x
  const top = boundingRect.y
  const right = left.plus(boundingRect.width)
  const bottom = top.plus(boundingRect.height)
  const stitchMargin = new BigNumber(stitchLine.stitchMargin)
  const taper = new BigNumber(normalizedPocketCluster.tPocketTaper)
  const tabDepth = getTPocketTabDepth(normalizedPocketCluster, boundingRect)
  const stackLength =
    normalizedPocketCluster.orientation === 'up' || normalizedPocketCluster.orientation === 'down'
      ? boundingRect.height
      : boundingRect.width
  const taperLength = stackLength.minus(tabDepth)
  const taperProgress = taperLength.isZero() ? new BigNumber(0) : stitchMargin.dividedBy(taperLength)
  const startInset = taper.minus(taper.times(taperProgress))
  const endInset = taper.minus(taper.times(taperProgress))
  const startOffset = new BigNumber(stitchLine.startOffset)
  const endOffset = new BigNumber(stitchLine.endOffset)

  let line: LineSchema

  switch (normalizedPocketCluster.orientation) {
    case 'up':
      line = {
        start: { x: clamp(left.plus(startInset), left, right).minus(startOffset), y: bottom.minus(stitchMargin) },
        end: { x: clamp(right.minus(endInset), left, right).plus(endOffset), y: bottom.minus(stitchMargin) },
      }
      break
    case 'down':
      line = {
        start: { x: clamp(left.plus(startInset), left, right).minus(startOffset), y: top.plus(stitchMargin) },
        end: { x: clamp(right.minus(endInset), left, right).plus(endOffset), y: top.plus(stitchMargin) },
      }
      break
    case 'left':
      line = {
        start: { x: right.minus(stitchMargin), y: clamp(top.plus(startInset), top, bottom).minus(startOffset) },
        end: { x: right.minus(stitchMargin), y: clamp(bottom.minus(endInset), top, bottom).plus(endOffset) },
      }
      break
    case 'right':
      line = {
        start: { x: left.plus(stitchMargin), y: clamp(top.plus(startInset), top, bottom).minus(startOffset) },
        end: { x: left.plus(stitchMargin), y: clamp(bottom.minus(endInset), top, bottom).plus(endOffset) },
      }
      break
  }

  return { line, path: createPathFromLine(line) }
}

const createPathFromLine = (line: LineSchema): PathSchema => {
  return {
    commands: [
      { type: 'moveTo', point: line.start },
      { type: 'lineTo', point: line.end },
    ],
  }
}
