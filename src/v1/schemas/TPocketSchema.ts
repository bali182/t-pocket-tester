import { PointSchema } from './PointSchema'
import { PolygonSchema } from './PolygonSchema'

export type TPocketSchema = {
  kind: 'tPocket'
  index: number
  topLeft: PointSchema
  topRight: PointSchema
  rightTabBottom: PointSchema
  rightTrapezoidTop: PointSchema
  rightBottom: PointSchema
  leftBottom: PointSchema
  leftTrapezoidTop: PointSchema
  leftTabBottom: PointSchema
  outline: PolygonSchema
}
