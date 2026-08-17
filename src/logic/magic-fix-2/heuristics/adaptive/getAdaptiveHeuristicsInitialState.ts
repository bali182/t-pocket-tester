import type { MagicFixHeuristicsGetInitialStateInput } from '../../../../schemas/magicFixHeuristics'
import { ADAPTIVE_MAGIC_FIX_NUMERIC_BAND_COUNTS, ADAPTIVE_MAGIC_FIX_ROUND_ITERATION_COUNTS } from './constants'
import { getAdjustableFields } from './getAdjustableFields'
import type { AdaptiveMagicFixHeuristicsState } from './types'
import { getAdaptiveMagicFixRoundConfigurations } from './utils/getAdaptiveMagicFixRoundConfigurations'
import { getFieldValue } from './utils/getFieldValue'
import { getMagicFixIssuesScore } from './utils/getMagicFixIssuesScore'

export const getAdaptiveHeuristicsInitialState = (
  input: MagicFixHeuristicsGetInitialStateInput<undefined>,
): AdaptiveMagicFixHeuristicsState => {
  const numericBandCount = ADAPTIVE_MAGIC_FIX_NUMERIC_BAND_COUNTS[input.config.effort]
  const configuredRoundIterationCount = ADAPTIVE_MAGIC_FIX_ROUND_ITERATION_COUNTS[input.config.effort]
  const roundIterationCount = Math.min(configuredRoundIterationCount, input.iterations)
  const fields = getAdjustableFields(input, numericBandCount)
  const bestValues = fields.map((field) => getFieldValue(input.subProject, field))
  const bestScore = getMagicFixIssuesScore(input.issues)

  return {
    bestValues,
    bestScore,
    lastValues: undefined,
    currentRound: {
      fields,
      configurations: getAdaptiveMagicFixRoundConfigurations(fields, roundIterationCount, 0),
      nextConfigurationIndex: 0,
      bestValues,
      bestScore,
      sequenceIndex: 0,
    },
  }
}
