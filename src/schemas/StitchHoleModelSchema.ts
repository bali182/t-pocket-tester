import { z } from 'zod'

import { PointSchema } from './PointSchema'

export const StitchHoleModelSchema = z.object({
  length: z.number(),
  center: PointSchema,
  rotation: z.number().optional(),
})

export type StitchHoleModel = z.infer<typeof StitchHoleModelSchema>
