import type {
  ValidationIssuesSchema,
  ValidationResultInvalidSchema,
  ValidationResultValidSchema,
} from '../schemas/validation'

export const createValidValidationResult = <T>(
  issues: ValidationIssuesSchema<T>,
  value: T,
  committedValue = value,
): ValidationResultValidSchema<T> => {
  return {
    committedValue,
    isValid: true,
    issues,
    value,
  }
}

export const createInvalidValidationResult = <T>(
  issues: ValidationIssuesSchema<T>,
  committedValue: T,
): ValidationResultInvalidSchema<T> => {
  return {
    committedValue,
    isValid: false,
    issues,
    value: undefined,
  }
}
