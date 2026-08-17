import type { MagicFixHeuristicsInput, MagicFixHeuristicsResult } from '../../../../schemas/magicFixHeuristics'
import type { AdaptiveMagicFixHeuristicsState } from './types'

export const getAdaptiveHeuristicsNext = (
  _input: MagicFixHeuristicsInput<undefined, AdaptiveMagicFixHeuristicsState>,
): MagicFixHeuristicsResult<AdaptiveMagicFixHeuristicsState> => {
  // TODO
  return {
    requests: [],
    state: undefined!,
  }
}
