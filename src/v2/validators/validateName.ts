import type { HasIdentitySchema } from '../schemas/components'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'

export const validateName = (input: string, currentValue: string, id: string, values: readonly HasIdentitySchema[]) => {
  if (input === '') {
    return createInvalidValidationResult<string>(
      {
        message: 'A név nem lehet üres.',
        severity: 'error',
      },
      currentValue,
    )
  }

  const hasDuplicateName = values.some((value) => value.id !== id && value.name === input)

  if (hasDuplicateName) {
    return createInvalidValidationResult<string>(
      {
        message: 'Ez a név már foglalt.',
        severity: 'error',
      },
      currentValue,
    )
  }

  return createValidValidationResult<string>(undefined, input)
}
