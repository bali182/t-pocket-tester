import BigNumber from 'bignumber.js'
import type { MagicFixHeuristicsInput, MagicFixHeuristicsResult } from '../../../../schemas/magicFixHeuristics'
import { isDefined } from '../../../../utils/isDefined'
import { getAdaptiveMagicFixChangeRequests } from './getAdaptiveMagicFixChangeRequests'
import type {
  AdaptiveMagicFixField,
  AdaptiveMagicFixFieldValue,
  AdaptiveMagicFixHeuristicsRound,
  AdaptiveMagicFixHeuristicsScore,
  AdaptiveMagicFixHeuristicsState,
} from './types'
import { getAdaptiveMagicFixNumericBands } from './utils/getAdaptiveMagicFixNumericBands'
import { getAdaptiveMagicFixRoundConfigurations } from './utils/getAdaptiveMagicFixRoundConfigurations'
import { getMagicFixIssuesScore } from './utils/getMagicFixIssuesScore'

export const getAdaptiveHeuristicsNext = (
  input: MagicFixHeuristicsInput<undefined, AdaptiveMagicFixHeuristicsState>,
): MagicFixHeuristicsResult<AdaptiveMagicFixHeuristicsState> => {
  const evaluatedRound = getEvaluatedRound(input, input.state.currentRound, input.state.lastValues)
  const nextConfiguration = evaluatedRound.configurations[evaluatedRound.nextConfigurationIndex]

  if (isDefined(nextConfiguration)) {
    return {
      requests: getAdaptiveMagicFixChangeRequests(evaluatedRound.fields, nextConfiguration.values),
      state: {
        ...input.state,
        lastValues: nextConfiguration.values,
        currentRound: {
          ...evaluatedRound,
          nextConfigurationIndex: evaluatedRound.nextConfigurationIndex + 1,
        },
      },
    }
  }

  const isRoundBestGlobalBest = isScoreBetter(evaluatedRound.bestScore, input.state.bestScore)
  const bestValues = isRoundBestGlobalBest ? evaluatedRound.bestValues : input.state.bestValues
  const bestScore = isRoundBestGlobalBest ? evaluatedRound.bestScore : input.state.bestScore
  const fields = isRoundBestGlobalBest
    ? getNarrowedFields(evaluatedRound.fields, evaluatedRound.bestValues)
    : evaluatedRound.fields
  const sequenceIndex = evaluatedRound.sequenceIndex + 1
  const remainingIterationCount = input.iterations - input.iteration
  const currentRound: AdaptiveMagicFixHeuristicsRound = {
    fields,
    configurations: getAdaptiveMagicFixRoundConfigurations(fields, remainingIterationCount, sequenceIndex),
    nextConfigurationIndex: 0,
    bestValues,
    bestScore,
    sequenceIndex,
  }
  const firstConfiguration = currentRound.configurations[0]

  if (!isDefined(firstConfiguration)) {
    return {
      requests: [],
      state: {
        bestValues,
        bestScore,
        lastValues: undefined,
        currentRound,
      },
    }
  }

  return {
    requests: getAdaptiveMagicFixChangeRequests(currentRound.fields, firstConfiguration.values),
    state: {
      bestValues,
      bestScore,
      lastValues: firstConfiguration.values,
      currentRound: {
        ...currentRound,
        nextConfigurationIndex: 1,
      },
    },
  }
}

const getEvaluatedRound = (
  input: MagicFixHeuristicsInput<undefined, AdaptiveMagicFixHeuristicsState>,
  currentRound: AdaptiveMagicFixHeuristicsRound,
  lastValues: readonly AdaptiveMagicFixFieldValue[] | undefined,
): AdaptiveMagicFixHeuristicsRound => {
  if (!isDefined(lastValues)) {
    return currentRound
  }

  const score = getMagicFixIssuesScore(input.issues)
  if (!isScoreBetter(score, currentRound.bestScore)) {
    return currentRound
  }

  return {
    ...currentRound,
    bestValues: lastValues,
    bestScore: score,
  }
}

const isScoreBetter = (
  candidate: AdaptiveMagicFixHeuristicsScore,
  currentBest: AdaptiveMagicFixHeuristicsScore,
): boolean => {
  if (candidate.issueCount !== currentBest.issueCount) {
    return candidate.issueCount < currentBest.issueCount
  }
  return candidate.totalDeviation.isLessThan(currentBest.totalDeviation)
}

const getNarrowedFields = (
  fields: readonly AdaptiveMagicFixField[],
  values: readonly AdaptiveMagicFixFieldValue[],
): AdaptiveMagicFixField[] => {
  return fields.map((field, index) => {
    if (field.type !== 'numeric') {
      return field
    }

    const value = values[index]
    if (!BigNumber.isBigNumber(value)) {
      throw new Error(`Expected numeric best value for adaptive Magic Fix field: "${field.path.join('.')}"!`)
    }
    const band = field.bands.find(
      (candidate) => value.isGreaterThanOrEqualTo(candidate.minValue) && value.isLessThanOrEqualTo(candidate.maxValue),
    )
    if (!isDefined(band)) {
      throw new Error(`Best value is outside its adaptive Magic Fix field range: "${field.path.join('.')}"!`)
    }

    return {
      ...field,
      minValue: band.minValue,
      maxValue: band.maxValue,
      bands: getAdaptiveMagicFixNumericBands(band.minValue, band.maxValue, field.bands.length),
    }
  })
}
