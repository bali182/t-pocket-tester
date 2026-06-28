import { z } from 'zod'

import { CardHolderInputSchema } from './CardHolderInputSchema'

export const CardHolderInputFieldSchema = z.object({
  key: CardHolderInputSchema.keyof(),
  label: z.string(),
  min: z.number().optional(),
  max: z.number().optional(),
})

export type CardHolderInputField = z.infer<typeof CardHolderInputFieldSchema>
