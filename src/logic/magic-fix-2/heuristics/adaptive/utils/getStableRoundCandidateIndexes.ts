import type { AdaptiveMagicFixFieldPath } from '../types'

/** FNV-1a's 32-bit offset basis; turns a field path and round index into a stable initial state. */
const FNV_1A_32_OFFSET_BASIS = 2_166_136_261
/** FNV-1a's 32-bit prime; mixes each hash input character. */
const FNV_1A_32_PRIME = 16_777_619
/** Numerical Recipes LCG multiplier; advances the deterministic shuffle state. */
const NUMERICAL_RECIPES_LCG_MULTIPLIER = 1_664_525
/** Numerical Recipes LCG increment; prevents the deterministic shuffle state from stalling. */
const NUMERICAL_RECIPES_LCG_INCREMENT = 1_013_904_223

export const getStableRoundCandidateIndexes = (
  path: AdaptiveMagicFixFieldPath,
  candidateCount: number,
  configurationCount: number,
  sequenceIndex: number,
): number[] => {
  const indexes = Array.from({ length: configurationCount }, (_, index) => index % candidateCount)
  const nextUint32 = createNextUint32(getStringHash(JSON.stringify({ path, sequenceIndex })))

  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const swapIndex = nextUint32() % (index + 1)
    ;[indexes[index], indexes[swapIndex]] = [indexes[swapIndex], indexes[index]]
  }

  return indexes
}

const getStringHash = (value: string): number => {
  let hash = FNV_1A_32_OFFSET_BASIS

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, FNV_1A_32_PRIME)
  }

  return hash >>> 0
}

const createNextUint32 = (seed: number): (() => number) => {
  let state = seed

  return () => {
    state = (Math.imul(state, NUMERICAL_RECIPES_LCG_MULTIPLIER) + NUMERICAL_RECIPES_LCG_INCREMENT) >>> 0
    return state
  }
}
