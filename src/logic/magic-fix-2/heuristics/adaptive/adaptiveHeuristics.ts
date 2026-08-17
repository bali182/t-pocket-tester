import type { MagicFixHeuristics } from '../../../../schemas/magicFixHeuristics'
import { getAdaptiveHeuristicsInitialState } from './getAdaptiveHeuristicsInitialState'
import { getAdaptiveHeuristicsIterations } from './getAdaptiveHeuristicsIterations'
import { getAdaptiveHeuristicsNext } from './getAdaptiveHeuristicsNext'
import type { AdaptiveMagicFixHeuristicsState } from './types'

export const adaptiveHeuristics: MagicFixHeuristics<undefined, AdaptiveMagicFixHeuristicsState> = {
  getIterations: getAdaptiveHeuristicsIterations,
  getPlan: () => undefined,
  getInitialState: getAdaptiveHeuristicsInitialState,
  getNextState: getAdaptiveHeuristicsNext,
}
