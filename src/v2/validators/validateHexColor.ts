import type { ValidatorSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'

const hexColorPattern = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/

export const validateHexColor: ValidatorSchema<string, string> = (input, currentValue) => {
  if (!hexColorPattern.test(input)) {
    return createInvalidValidationResult<string, string>(
      {
        message: 'Érvénytelen hex szín.',
        severity: 'error',
      },
      currentValue,
    )
  }

  return createValidValidationResult<string, string>(undefined, input)
}
