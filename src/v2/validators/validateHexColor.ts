import { ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'

const hexColorPattern = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/

export const validateHexColor = (input: string, currentValue: string): ValidationResultSchema<string> => {
  if (!hexColorPattern.test(input)) {
    return createInvalidValidationResult<string>(
      {
        message: 'Érvénytelen hex szín.',
        severity: 'error',
      },
      currentValue,
    )
  }

  return createValidValidationResult<string>(undefined, input)
}
