import type {
  ValidationIssuesSchema,
  ValidationResultInvalidSchema,
  ValidationResultValidSchema,
} from '../schemas/validation'

export const createValidValidationResult = <I, O>(
  issues: ValidationIssuesSchema<I>,
  value: O,
  committedValue = value,
): ValidationResultValidSchema<I, O> => {
  return {
    committedValue,
    isValid: true,
    issues,
    value,
  }
}

export const createInvalidValidationResult = <I, O>(
  issues: ValidationIssuesSchema<I>,
  committedValue: O,
): ValidationResultInvalidSchema<I, O> => {
  return {
    committedValue,
    isValid: false,
    issues,
    value: undefined,
  }
}
