import { z } from 'zod'

export const CardOrientationSchema = z.union([z.literal('landscape'), z.literal('portrait')])

export type CardOrientation = z.infer<typeof CardOrientationSchema>
