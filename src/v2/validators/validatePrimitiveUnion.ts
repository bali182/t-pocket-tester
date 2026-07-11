import type { ValidationResultSchema } from '../schemas/validation'
import { isDefined } from '../utils/isDefined'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'

export const validatePrimitiveUnion = <T extends string>(
  value: string | undefined,
  allowedValues: Record<T, boolean>,
  allowUndefined = false,
): ValidationResultSchema<string | undefined, T | undefined> => {
  if (!isDefined(value)) {
    if (allowUndefined) {
      return createValidValidationResult<string | undefined, undefined>(undefined, undefined)
    }

    return createInvalidValidationResult<string | undefined>({
      message: 'Kötelező érték.',
      severity: 'error',
    })
  }

  if (!isAllowedPrimitiveUnionValue(value, allowedValues)) {
    return createInvalidValidationResult<string | undefined>({
      message: 'Érvénytelen érték.',
      severity: 'error',
    })
  }

  return createValidValidationResult<string | undefined, T>(undefined, value)
}

const isAllowedPrimitiveUnionValue = <T extends string>(
  value: string,
  allowedValues: Record<T, boolean>,
): value is T => {
  return Object.keys(allowedValues).includes(value)
}
