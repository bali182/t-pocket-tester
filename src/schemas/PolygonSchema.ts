import { z } from 'zod'

import { PointSchema } from './PointSchema'

export const PolygonSchema = z.object({
  points: z.array(PointSchema),
})

export type Polygon = z.infer<typeof PolygonSchema>
