import type { IssueSchema, SeveritySchema, ValidationIssuesSchema } from '../schemas/validation'
import { isDefined } from './isDefined'
import { isRecord } from './isRecord'

export const hasValidationErrors = <T>(result: ValidationIssuesSchema<T>): boolean => {
  return hasValidationErrorsInValue(result)
}

const hasValidationErrorsInValue = (value: unknown): boolean => {
  if (!isDefined(value)) {
    return false
  }

  if (isIssueSchema(value)) {
    return value.severity === 'error'
  }

  if (Array.isArray(value)) {
    return value.some(hasValidationErrorsInValue)
  }

  if (isRecord(value)) {
    return Object.values(value).some(hasValidationErrorsInValue)
  }

  return false
}

const isIssueSchema = (value: unknown): value is IssueSchema => {
  if (!isRecord(value)) {
    return false
  }

  return isSeverity(value.severity) && typeof value.message === 'string'
}

const isSeverity = (value: unknown): value is SeveritySchema => {
  return value === 'error' || value === 'warning' || value === 'info'
}
