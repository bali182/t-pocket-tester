import type {
  ValidationIssuesSchema,
  ValidationResultInvalidSchema,
  ValidationResultValidSchema,
} from '../schemas/validation'

export const createValidValidationResult = <I, O>(
  issues: ValidationIssuesSchema<I>,
  value: O,
): ValidationResultValidSchema<I, O> => {
  return {
    isValid: true,
    issues,
    value,
  }
}

export const createInvalidValidationResult = <I>(
  issues: ValidationIssuesSchema<I>,
): ValidationResultInvalidSchema<I> => {
  return {
    isValid: false,
    issues,
    value: undefined,
  }
}
