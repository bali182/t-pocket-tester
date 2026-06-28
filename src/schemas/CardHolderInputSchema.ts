import { z } from 'zod'

import { SizeSchema } from './SizeSchema'

export const CardHolderInputSchema = z.object({
  cardSize: SizeSchema,
  pocketCount: z.number(),
  stitchMargin: z.number(),
  cardSideClearanceFromStitch: z.number(),
  cardBottomClearanceFromStitch: z.number(),
  pocketSpacing: z.number(),
  tPocketTabWidth: z.number(),
  tPocketTaper: z.number(),
  pocketHeight: z.number(),
})

export type CardHolderInput = z.infer<typeof CardHolderInputSchema>
