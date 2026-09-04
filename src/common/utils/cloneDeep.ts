export const cloneDeep = <T>(value: T): T => {
  if (value === null || value === undefined) {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => cloneDeep(item)) as unknown as T
  }

  switch (typeof value) {
    case 'number': {
      if (Number.isNaN(value)) {
        throw new Error(`Unexpected type: ${value}`)
      }
    }
    case 'string':
    case 'boolean':
      return value
    case 'object': {
      const prototype = Object.getPrototypeOf(value)
      if (prototype !== Object.prototype && prototype !== null) {
        throw new Error(`Unexpected object-based type: ${value}`)
      }
      const clone = {} as T
      for (const key of Object.keys(value)) {
        clone[key as keyof T] = cloneDeep(value[key as keyof T])
      }
      return clone
    }
  }

  throw new Error(`Unexpected type: ${value}`)
}
