import type { MagicFixBaseInput } from '../../../../schemas/magicFixHeuristics'
import { ADAPTIVE_MAGIC_FIX_EFFORT_MULTIPLIERS } from './constants'
import { getAdjustableFields } from './getAdjustableFields'

export const getAdaptiveHeuristicsIterations = (input: MagicFixBaseInput): number => {
  return getAdjustableFields(input).length * ADAPTIVE_MAGIC_FIX_EFFORT_MULTIPLIERS[input.config.effort]
}
