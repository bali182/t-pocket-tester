import { z } from 'zod'

import { BackPanelModelSchema } from './BackPanelModelSchema'
import { CardModelSchema } from './CardModelSchema'
import { SizeSchema } from './SizeSchema'
import { TopPocketModelSchema } from './TopPocketModelSchema'
import { TPocketModelSchema } from './TPocketModelSchema'

export const CalculatedCardHolderModelSchema = z.object({
  overallSize: SizeSchema,
  backPanel: BackPanelModelSchema,
  cards: z.array(CardModelSchema),
  tPockets: z.array(TPocketModelSchema),
  coverPocket: TopPocketModelSchema,
})

export type CalculatedCardHolderModel = z.infer<typeof CalculatedCardHolderModelSchema>
