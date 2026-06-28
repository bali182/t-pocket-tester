import { z } from 'zod'

import { RectSchema } from './RectSchema'

export const CardModelSchema = z.object({
  kind: z.literal('card'),
  index: z.number(),
  outline: RectSchema,
})

export type CardModel = z.infer<typeof CardModelSchema>
