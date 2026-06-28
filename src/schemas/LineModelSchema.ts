import { z } from 'zod'

import { PointSchema } from './PointSchema'

export const LineModelSchema = z.object({
  start: PointSchema,
  end: PointSchema,
})

export type LineModel = z.infer<typeof LineModelSchema>
