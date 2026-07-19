import BigNumber from 'bignumber.js'

import type { LineSchema } from '../../schemas/geometry'
import type { PocketClusterStitchLineSchema, StitchHoleSchema } from '../../schemas/stitching'
import { isDefined } from '../../utils/isDefined'
import {
  findNextStitchHole,
  getSegmentTangentRotation,
  getStitchHoleRotation,
  type StitchHoleLineSegment,
} from './stitchHoleGeometry'

export const calculateTPocketStitchHoles = (
  stitchLine: PocketClusterStitchLineSchema,
  line: LineSchema,
): StitchHoleSchema[] => {
  const stitchHoleDistance = new BigNumber(stitchLine.stitchHoleDistance)

  if (!stitchHoleDistance.isGreaterThan(0)) {
    return []
  }

  const directedLine = stitchLine.stitchDirection === 'start-to-end' ? line : { start: line.end, end: line.start }
  const segment: StitchHoleLineSegment = { type: 'line', start: directedLine.start, end: directedLine.end }
  const holes: StitchHoleSchema[] = [
    {
      center: segment.start,
      rotation: getSegmentTangentRotation(segment, segment.start),
    },
  ]
  let previousHole = holes[0]
  let cursor = { segmentIndex: 0, point: segment.start }
  let nextHole = findNextStitchHole(previousHole.center, stitchHoleDistance, [segment], cursor)

  while (isDefined(nextHole)) {
    const hole: StitchHoleSchema = {
      center: nextHole.center,
      rotation: getStitchHoleRotation(previousHole.center, nextHole.center),
    }
    holes.push(hole)
    previousHole = hole
    cursor = nextHole.cursor
    nextHole = findNextStitchHole(previousHole.center, stitchHoleDistance, [segment], cursor)
  }

  return holes
}
