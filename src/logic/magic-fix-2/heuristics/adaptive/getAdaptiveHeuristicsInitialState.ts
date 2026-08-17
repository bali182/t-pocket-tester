import { MagicFixHeuristicsGetInitialStateInput } from '../../../../schemas/magicFixHeuristics'
import { AdaptiveMagicFixHeuristicsPlan, AdaptiveMagicFixHeuristicsState } from './types'

export const getAdaptiveHeuristicsInitialState = (
  _nput: MagicFixHeuristicsGetInitialStateInput<AdaptiveMagicFixHeuristicsPlan>,
): AdaptiveMagicFixHeuristicsState => {
  // TODO
  return {
    bestScore: undefined!,
    bestValues: undefined!,
    lastValues: undefined!,
  }
}
