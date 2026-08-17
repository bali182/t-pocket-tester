import { describe, expect, it } from 'vitest'

import { ADAPTIVE_MAGIC_FIX_NUMERIC_BAND_COUNTS } from '../constants'
import { getStableRoundCandidateIndexes } from './getStableRoundCandidateIndexes'

describe('getStableRoundCandidateIndexes', () => {
  it.each(Object.values(ADAPTIVE_MAGIC_FIX_NUMERIC_BAND_COUNTS))(
    'should use every candidate index exactly once when candidate and configuration counts are both %i',
    (count) => {
      const path = ['root-panel', 'root', 'width'] as const

      const indexes = getStableRoundCandidateIndexes(path, count, count, 0)

      expect(indexes).toHaveLength(count)
      expect([...indexes].sort((left, right) => left - right)).toEqual(
        Array.from({ length: count }, (_, index) => index),
      )
    },
  )

  it('should return the same balanced candidate order for the same field path and sequence index', () => {
    const path = ['root-panel', 'root', 'width'] as const

    const firstOrder = getStableRoundCandidateIndexes(path, 5, 12, 0)
    const secondOrder = getStableRoundCandidateIndexes(path, 5, 12, 0)

    expect(firstOrder).toEqual([0, 4, 2, 4, 3, 1, 1, 3, 0, 0, 1, 2])
    expect(secondOrder).toEqual(firstOrder)
    expect(firstOrder).toHaveLength(12)
    expect(firstOrder.filter((index) => index === 0)).toHaveLength(3)
    expect(firstOrder.filter((index) => index === 1)).toHaveLength(3)
    expect(firstOrder.filter((index) => index === 2)).toHaveLength(2)
    expect(firstOrder.filter((index) => index === 3)).toHaveLength(2)
    expect(firstOrder.filter((index) => index === 4)).toHaveLength(2)
  })

  it('should derive a different fixed order for a different field path', () => {
    const rootWidthPath = ['root-panel', 'root', 'width'] as const
    const lineOffsetPath = ['component-bounds-stitch-line', 'line', 'topStartOffset'] as const

    const rootWidthOrder = getStableRoundCandidateIndexes(rootWidthPath, 5, 12, 0)
    const lineOffsetOrder = getStableRoundCandidateIndexes(lineOffsetPath, 5, 12, 0)

    expect(rootWidthOrder).toEqual([0, 4, 2, 4, 3, 1, 1, 3, 0, 0, 1, 2])
    expect(lineOffsetOrder).toEqual([3, 0, 3, 4, 0, 0, 1, 1, 2, 2, 4, 1])
  })

  it('should derive a different fixed order for a different sequence index', () => {
    const path = ['root-panel', 'root', 'width'] as const

    expect(getStableRoundCandidateIndexes(path, 5, 5, 0)).toEqual([4, 3, 0, 2, 1])
    expect(getStableRoundCandidateIndexes(path, 5, 5, 1)).not.toEqual([4, 3, 0, 2, 1])
  })
})
