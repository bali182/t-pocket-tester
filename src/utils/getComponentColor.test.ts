import { describe, expect, it } from 'vitest'

import { getComponentColor } from './getComponentColor'

describe('getComponentColor', () => {
  it('keeps an already light base color unchanged', () => {
    expect(getComponentColor('#fdfdfc', 1)).toBe('#fdfdfc')
  })

  it('lightens a dark base color for nested components', () => {
    expect(getComponentColor('#1a1a1a', 1)).toBe('#282828')
  })
})
