import type { BaseValidationContextSchema, ValidationResultSchema } from '../schemas/validation'
import { isDefined } from '../utils/isDefined'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateHexColor } from './validateHexColor'

export const validateOptionalHexColor = (
  input: string | undefined,
  currentValue: string | undefined,
  context: BaseValidationContextSchema,
): ValidationResultSchema<string | undefined> => {
  if (!isDefined(input)) {
    return createValidValidationResult(undefined, undefined)
  }

  const result = validateHexColor(input, input, context)

  if (!result.isValid) {
    return createInvalidValidationResult(result.issues, currentValue)
  }

  return createValidValidationResult(result.issues, result.value)
}
