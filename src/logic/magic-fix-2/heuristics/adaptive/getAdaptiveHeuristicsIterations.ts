import type { MagicFixBaseInput } from '../../../../schemas/magicFixHeuristics'
import { ADAPTIVE_MAGIC_FIX_EFFORT_MULTIPLIERS } from './constants'
import { getAdjustablePaths } from './getAdjustablePaths'

export const getAdaptiveHeuristicsIterations = (input: MagicFixBaseInput): number => {
  return getAdjustablePaths(input).length * ADAPTIVE_MAGIC_FIX_EFFORT_MULTIPLIERS[input.config.effort]
}
