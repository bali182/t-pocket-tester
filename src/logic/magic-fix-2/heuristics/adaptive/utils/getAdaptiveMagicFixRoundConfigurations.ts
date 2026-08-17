import { isDefined } from '../../../../../utils/isDefined'
import type { AdaptiveMagicFixConfiguration, AdaptiveMagicFixField, AdaptiveMagicFixFieldValue } from '../types'
import { getStableRoundCandidateIndexes } from './getStableRoundCandidateIndexes'

export const getAdaptiveMagicFixRoundConfigurations = (
  fields: readonly AdaptiveMagicFixField[],
  iterationCount: number,
  sequenceIndex: number,
): AdaptiveMagicFixConfiguration[] => {
  const configurationCount = getConfigurationCount(fields, iterationCount)
  const candidateIndexesByField = fields.map((field) =>
    getStableRoundCandidateIndexes(field.path, getCandidateCount(field), configurationCount, sequenceIndex),
  )
  const usedCombinations = new Set<string>()

  return Array.from({ length: configurationCount }, (_, configurationIndex) => {
    const candidateIndexes = candidateIndexesByField.map((indexes) => indexes[configurationIndex])
    const uniqueCandidateIndexes = getUniqueCandidateIndexes(fields, candidateIndexes, usedCombinations)

    return {
      values: fields.map((field, fieldIndex) => getConfigurationValue(field, uniqueCandidateIndexes[fieldIndex])),
    }
  })
}

const getConfigurationCount = (fields: readonly AdaptiveMagicFixField[], iterationCount: number): number => {
  if (fields.length === 0) {
    return 0
  }

  const combinationCount = fields.reduce((total, field) => total * BigInt(getCandidateCount(field)), 1n)
  const requestedCount = BigInt(iterationCount)

  return combinationCount < requestedCount ? Number(combinationCount) : iterationCount
}

const getUniqueCandidateIndexes = (
  fields: readonly AdaptiveMagicFixField[],
  candidateIndexes: number[],
  usedCombinations: Set<string>,
): number[] => {
  const candidateIndexKey = getCandidateIndexKey(candidateIndexes)
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

const getConfigurationValue = (field: AdaptiveMagicFixField, candidateIndex: number): AdaptiveMagicFixFieldValue => {
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
