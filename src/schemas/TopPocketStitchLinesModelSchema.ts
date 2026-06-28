import { z } from 'zod'

import { LineModelSchema } from './LineModelSchema'

export const TopPocketStitchLinesModelSchema = z.object({
  leftStitchLine: LineModelSchema,
  rightStitchLine: LineModelSchema,
  bottomStitchLine: LineModelSchema,
})

export type TopPocketStitchLinesModel = z.infer<typeof TopPocketStitchLinesModelSchema>
