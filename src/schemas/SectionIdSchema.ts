import { z } from 'zod'

export const SectionIdSchema = z.union([z.literal('card'), z.literal('pockets'), z.literal('stitching')])

export type SectionId = z.infer<typeof SectionIdSchema>
