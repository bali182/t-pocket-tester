import { z } from 'zod'

export const SizeSchema = z.object({
  width: z.number(),
  height: z.number(),
})

export type Size = z.infer<typeof SizeSchema>
