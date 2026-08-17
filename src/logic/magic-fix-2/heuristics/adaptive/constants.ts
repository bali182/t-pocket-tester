import type { MagicFixEffortSchema } from '../../../../schemas/magicFixConfig'

export const ADAPTIVE_MAGIC_FIX_EFFORT_MULTIPLIERS: Record<MagicFixEffortSchema, number> = {
  low: 100,
  medium: 1_000,
  high: 10_000,
}
