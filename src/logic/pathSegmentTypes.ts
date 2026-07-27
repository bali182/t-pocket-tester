import type BigNumber from 'bignumber.js'

import type { PointSchema } from '../schemas/geometry'

export type LinePathSegment = {
  type: 'line'
  start: PointSchema
  end: PointSchema
}

export type ArcPathSegment = {
  type: 'arc'
  start: PointSchema
  end: PointSchema
  radius: BigNumber
  center: PointSchema
  startAngle: number
  sweepAngle: number
}

export type PathSegment = LinePathSegment | ArcPathSegment

export type PathSegmentIntersection = {
  firstProgress: BigNumber
  secondProgress: BigNumber
  point: PointSchema
}
