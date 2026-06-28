import { z } from 'zod'

import { RectSchema } from './RectSchema'

export const TopPocketModelSchema = z.object({
  kind: z.literal('topPocket'),
  outline: RectSchema,
})

export type TopPocketModel = z.infer<typeof TopPocketModelSchema>
