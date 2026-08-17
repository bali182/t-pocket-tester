import type { MagicFixHeuristicsPlanInput } from '../../../../schemas/magicFixHeuristics'
import { isDefined } from '../../../../utils/isDefined'
import { ADAPTIVE_MAGIC_FIX_DISCOVERY_ITERATION_COUNTS, ADAPTIVE_MAGIC_FIX_NUMERIC_BAND_COUNTS } from './constants'
import { getAdjustableFields } from './getAdjustableFields'
import type {
  AdaptiveMagicFixDiscoveryConfiguration,
  AdaptiveMagicFixField,
  AdaptiveMagicFixFieldValue,
  AdaptiveMagicFixHeuristicsPlan,
} from './types'
import { getStableDiscoveryCandidateIndexes } from './utils/getStableDiscoveryCandidateIndexes'

export const getAdaptiveHeuristicsPlan = (input: MagicFixHeuristicsPlanInput): AdaptiveMagicFixHeuristicsPlan => {
  const numericBandCount = ADAPTIVE_MAGIC_FIX_NUMERIC_BAND_COUNTS[input.config.effort]
  const configuredDiscoveryIterationCount = ADAPTIVE_MAGIC_FIX_DISCOVERY_ITERATION_COUNTS[input.config.effort]
  const discoveryIterationCount = Math.min(configuredDiscoveryIterationCount, input.iterations)
  const fields = getAdjustableFields(input, numericBandCount)
  const configurationCount = getDiscoveryConfigurationCount(fields, discoveryIterationCount)

  return {
    fields,
    discoveryConfigurations: getDiscoveryConfigurations(fields, configurationCount),
  }
}

const getDiscoveryConfigurationCount = (
  fields: readonly AdaptiveMagicFixField[],
  discoveryIterationCount: number,
): number => {
  if (fields.length === 0) {
    return 0
  }

  const combinationCount = fields.reduce((total, field) => total * BigInt(getCandidateCount(field)), 1n)
  const requestedCount = BigInt(discoveryIterationCount)

  return combinationCount < requestedCount ? Number(combinationCount) : discoveryIterationCount
}

const getDiscoveryConfigurations = (
  fields: readonly AdaptiveMagicFixField[],
  configurationCount: number,
): AdaptiveMagicFixDiscoveryConfiguration[] => {
  const candidateIndexesByField = fields.map((field) =>
    getStableDiscoveryCandidateIndexes(field.path, getCandidateCount(field), configurationCount),
  )
  const usedCombinations = new Set<string>()

  return Array.from({ length: configurationCount }, (_, configurationIndex) => {
    const candidateIndexes = candidateIndexesByField.map((indexes) => indexes[configurationIndex])
    const uniqueCandidateIndexes = getUniqueCandidateIndexes(fields, candidateIndexes, usedCombinations)

    return {
      values: fields.map((field, fieldIndex) => getDiscoveryValue(field, uniqueCandidateIndexes[fieldIndex])),
    }
  })
}

const getUniqueCandidateIndexes = (
  fields: readonly AdaptiveMagicFixField[],
  candidateIndexes: number[],
  usedCombinations: Set<string>,
): number[] => {
  const candidateIndexKey = candidateIndexes.join(':')
  if (!usedCombinations.has(candidateIndexKey)) {
    usedCombinations.add(candidateIndexKey)
    return candidateIndexes
  }

  let combinationIndex = 0n
  while (usedCombinations.has(getCandidateIndexKey(getMixedRadixCandidateIndexes(fields, combinationIndex)))) {
    combinationIndex += 1n
  }

  const replacementCandidateIndexes = getMixedRadixCandidateIndexes(fields, combinationIndex)
  usedCombinations.add(getCandidateIndexKey(replacementCandidateIndexes))
  return replacementCandidateIndexes
}

const getMixedRadixCandidateIndexes = (
  fields: readonly AdaptiveMagicFixField[],
  combinationIndex: bigint,
): number[] => {
  let remainingIndex = combinationIndex

  return fields.map((field) => {
    const candidateCount = BigInt(getCandidateCount(field))
    const candidateIndex = Number(remainingIndex % candidateCount)
    remainingIndex /= candidateCount
    return candidateIndex
  })
}

const getCandidateIndexKey = (candidateIndexes: readonly number[]): string => candidateIndexes.join(':')

const getCandidateCount = (field: AdaptiveMagicFixField): number => {
  if (field.type === 'numeric') {
    return field.bands.length
  }
  return 2
}

const getDiscoveryValue = (field: AdaptiveMagicFixField, candidateIndex: number): AdaptiveMagicFixFieldValue => {
  switch (field.type) {
    case 'numeric': {
      const band = field.bands[candidateIndex]
      if (!isDefined(band)) {
        throw new Error(`Missing numeric band at index ${candidateIndex}!`)
      }
      return band.minValue.plus(band.maxValue).dividedBy(2)
    }
    case 'boolean':
      return candidateIndex === 0 ? field.initialValue : !field.initialValue
    case 'horizontal-direction':
    case 'vertical-direction':
    case 'pocket-cluster-direction':
      return candidateIndex === 0 ? field.initialValue : field.alternativeValue
  }
}
