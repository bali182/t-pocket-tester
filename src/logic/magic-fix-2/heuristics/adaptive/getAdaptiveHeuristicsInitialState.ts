import type { MagicFixHeuristicsGetInitialStateInput } from '../../../../schemas/magicFixHeuristics'
import type { AdaptiveMagicFixHeuristicsPlan, AdaptiveMagicFixHeuristicsState } from './types'
import { getFieldValue } from './utils/getFieldValue'
import { getMagicFixIssuesScore } from './utils/getMagicFixIssuesScore'

export const getAdaptiveHeuristicsInitialState = (
  input: MagicFixHeuristicsGetInitialStateInput<AdaptiveMagicFixHeuristicsPlan>,
): AdaptiveMagicFixHeuristicsState => {
  return {
    bestScore: getMagicFixIssuesScore(input.issues),
    bestValues: input.plan.fields.map((field) => getFieldValue(input.subProject, field)),
    lastValues: undefined,
  }
}
