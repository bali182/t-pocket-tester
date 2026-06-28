import { z } from 'zod'

import { RectSchema } from './RectSchema'

export const BackPanelModelSchema = z.object({
  kind: z.literal('backPanel'),
  outline: RectSchema,
})

export type BackPanelModel = z.infer<typeof BackPanelModelSchema>
