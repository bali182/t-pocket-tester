import { z } from 'zod'

import { LineModelSchema } from './LineModelSchema'

export const TPocketStitchLinesModelSchema = z.object({
  leftTabStitchLine: LineModelSchema,
  rightTabStitchLine: LineModelSchema,
  bottomStitchLine: LineModelSchema,
})

export type TPocketStitchLinesModel = z.infer<typeof TPocketStitchLinesModelSchema>
