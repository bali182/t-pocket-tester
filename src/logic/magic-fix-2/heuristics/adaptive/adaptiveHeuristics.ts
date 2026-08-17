import type { MagicFixHeuristics } from '../../../../schemas/magicFixHeuristics'
import { getAdaptiveHeuristicsInitialState } from './getAdaptiveHeuristicsInitialState'
import { getAdaptiveHeuristicsIterations } from './getAdaptiveHeuristicsIterations'
import { getAdaptiveHeuristicsNext } from './getAdaptiveHeuristicsNext'
import { getAdaptiveHeuristicsPlan } from './getAdaptiveHeuristicsPlan'
import type { AdaptiveMagicFixHeuristicsPlan, AdaptiveMagicFixHeuristicsState } from './types'

export const adaptiveHeuristics: MagicFixHeuristics<AdaptiveMagicFixHeuristicsPlan, AdaptiveMagicFixHeuristicsState> = {
  getIterations: getAdaptiveHeuristicsIterations,
  getPlan: getAdaptiveHeuristicsPlan,
  getInitialState: getAdaptiveHeuristicsInitialState,
  getNextState: getAdaptiveHeuristicsNext,
}
