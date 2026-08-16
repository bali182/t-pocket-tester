import { describe, expect, it } from 'vitest'
import { cloneDeep } from './cloneDeep'

describe('cloneDeep', () => {
  it('should clone primitives', () => {
    expect(cloneDeep('test')).toBe('test')
    expect(cloneDeep(100)).toBe(100)
    expect(cloneDeep(false)).toBe(false)
    expect(cloneDeep(undefined)).toBe(undefined)
    expect(cloneDeep(null)).toBe(null)
  })

  it('should throw on unexpected primitive-likes', () => {
    expect(() => cloneDeep(Symbol('test'))).toThrow()
    expect(() => cloneDeep(new Date())).toThrow()
    expect(() => cloneDeep(NaN)).toThrow()
  })

  it('should clone simple arrays', () => {
    const stringArray = ['A', 'B', 'C']
    const numberArray = [1, 2, 3]
    const booleanArray = [true, false]

    const clonedStringArray = cloneDeep(stringArray)
    const clonedNumberArray = cloneDeep(numberArray)
    const clonedBooleanArray = cloneDeep(booleanArray)

    expect(clonedStringArray).toEqual(stringArray)
    expect(clonedNumberArray).toEqual(numberArray)
    expect(clonedBooleanArray).toEqual(booleanArray)

    expect(clonedStringArray).not.toBe(stringArray)
    expect(clonedNumberArray).not.toBe(numberArray)
    expect(clonedBooleanArray).not.toBe(booleanArray)
  })

  it('should clone object', () => {
    const object = {
      s: 'test',
      n: 1220,
      obj: {
        str: 'name',
        b: false,
        bb: true,
        'foo bar': {
          n: 120.32,
        },
      },
      arr: [1, 2, 3, 4, 'a', 'b', { x: 12 }],
    }
    const clone = cloneDeep(object)

    expect(clone).toEqual(object)
    expect(clone).not.toBe(object)
  })
})
