import { describe, expect, it } from 'vitest'

import { ADAPTIVE_MAGIC_FIX_NUMERIC_BAND_COUNTS } from '../constants'
import { getStableDiscoveryCandidateIndexes } from './getStableDiscoveryCandidateIndexes'

describe('getStableDiscoveryCandidateIndexes', () => {
  it.each(Object.values(ADAPTIVE_MAGIC_FIX_NUMERIC_BAND_COUNTS))(
    'should use every candidate index exactly once when candidate and iteration counts are both %i',
    (count) => {
      const path = ['root-panel', 'root', 'width'] as const

      const indexes = getStableDiscoveryCandidateIndexes(path, count, count)

      expect(indexes).toHaveLength(count)
      expect([...indexes].sort((left, right) => left - right)).toEqual(
        Array.from({ length: count }, (_, index) => index),
      )
    },
  )

  it('should return the same balanced candidate order for the same field path', () => {
    const path = ['root-panel', 'root', 'width'] as const

    const firstOrder = getStableDiscoveryCandidateIndexes(path, 5, 12)
    const secondOrder = getStableDiscoveryCandidateIndexes(path, 5, 12)

    expect(firstOrder).toEqual([1, 1, 4, 4, 2, 3, 0, 0, 0, 1, 2, 3])
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

    const rootWidthOrder = getStableDiscoveryCandidateIndexes(rootWidthPath, 5, 12)
    const lineOffsetOrder = getStableDiscoveryCandidateIndexes(lineOffsetPath, 5, 12)

    expect(rootWidthOrder).toEqual([1, 1, 4, 4, 2, 3, 0, 0, 0, 1, 2, 3])
    expect(lineOffsetOrder).toEqual([0, 3, 2, 4, 1, 1, 1, 0, 2, 0, 4, 3])
  })
})
