import { z } from 'zod'

export const RectSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
})

export type Rect = z.infer<typeof RectSchema>
