import { MagicFixHeuristicsInput, MagicFixHeuristicsResult } from '../../../../schemas/magicFixHeuristics'
import { AdaptiveMagicFixHeuristicsPlan, AdaptiveMagicFixHeuristicsState } from './types'

export const getAdaptiveHeuristicsNext = (
  _input: MagicFixHeuristicsInput<AdaptiveMagicFixHeuristicsPlan, AdaptiveMagicFixHeuristicsState>,
): MagicFixHeuristicsResult<AdaptiveMagicFixHeuristicsState> => {
  // TODO
  return {
    requests: [],
    state: undefined!,
  }
}
