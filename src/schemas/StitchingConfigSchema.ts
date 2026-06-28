import { z } from 'zod'

export const StitchingConfigSchema = z.object({
  stitchDistance: z.number(),
  stitchLength: z.number(),
})

export type StitchingConfig = z.infer<typeof StitchingConfigSchema>
