import { z } from 'zod'

import { PointSchema } from './PointSchema'
import { PolygonSchema } from './PolygonSchema'

export const TPocketModelSchema = z.object({
  kind: z.literal('tPocket'),
  index: z.number(),
  topLeft: PointSchema,
  topRight: PointSchema,
  rightTabBottom: PointSchema,
  rightTrapezoidTop: PointSchema,
  rightBottom: PointSchema,
  leftBottom: PointSchema,
  leftTrapezoidTop: PointSchema,
  leftTabBottom: PointSchema,
  outline: PolygonSchema,
})

export type TPocketModel = z.infer<typeof TPocketModelSchema>
