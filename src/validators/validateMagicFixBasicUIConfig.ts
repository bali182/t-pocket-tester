import type { EditableSchema } from '../schemas/editable'
import type {
  MagicFixBaseConfigSchema,
  MagicFixBasicUIConfigSchema,
  MagicFixEffortSchema,
} from '../schemas/magicFixConfig'
import type { BaseValidationContextSchema, ValidationResultSchema } from '../schemas/validation'
import { isDefined } from '../utils/isDefined'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateNumber } from './validateNumber'
import { validatePrimitiveUnion } from './validatePrimitiveUnion'

const magicFixEfforts: Record<MagicFixEffortSchema, boolean> = {
  high: true,
  low: true,
  medium: true,
}

export const validateMagicFixBaseConfig = (
  input: EditableSchema<MagicFixBaseConfigSchema>,
  currentValue: MagicFixBaseConfigSchema,
  context: BaseValidationContextSchema,
): ValidationResultSchema<MagicFixBaseConfigSchema> => {
  const accuracy = validateNumber(input.accuracy, currentValue.accuracy, context, { min: 0 })
  const effort = validatePrimitiveUnion(input.effort, currentValue.effort, magicFixEfforts, context)
  const issues = { accuracy: accuracy.issues, effort: effort.issues }
  const committedValue = { accuracy: accuracy.committedValue, effort: effort.committedValue }

  if (!accuracy.isValid || !effort.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}

export const validateMagicFixBasicUIConfig = (
  input: EditableSchema<MagicFixBasicUIConfigSchema>,
  currentValue: MagicFixBasicUIConfigSchema,
  context: BaseValidationContextSchema,
): ValidationResultSchema<MagicFixBasicUIConfigSchema> => {
  const preferredMinimumDistanceFromEdge = validateOptionalNumber(
    input.preferredMinimumDistanceFromEdge,
    currentValue.preferredMinimumDistanceFromEdge,
    context,
  )
  const maxDecrease = validateOptionalNumber(
    input.modifyRange.maxDecrease,
    currentValue.modifyRange.maxDecrease,
    context,
  )
  const maxIncrease = validateOptionalNumber(
    input.modifyRange.maxIncrease,
    currentValue.modifyRange.maxIncrease,
    context,
  )
  const issues = {
    modifyRange: { maxDecrease: maxDecrease.issues, maxIncrease: maxIncrease.issues },
    preferredMinimumDistanceFromEdge: preferredMinimumDistanceFromEdge.issues,
  }
  const committedValue = {
    modifyRange: { maxDecrease: maxDecrease.committedValue, maxIncrease: maxIncrease.committedValue },
    preferredMinimumDistanceFromEdge: preferredMinimumDistanceFromEdge.committedValue,
  }

  if (!preferredMinimumDistanceFromEdge.isValid || !maxDecrease.isValid || !maxIncrease.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}

const validateOptionalNumber = (
  input: string | undefined,
  currentValue: number | undefined,
  context: BaseValidationContextSchema,
): ValidationResultSchema<number | undefined> => {
  if (!isDefined(input)) {
    return createValidValidationResult(undefined, undefined)
  }

  const result = validateNumber(input, currentValue ?? 0, context, { min: 0 })

  if (!result.isValid) {
    return createInvalidValidationResult(result.issues, currentValue)
  }

  return createValidValidationResult(result.issues, result.committedValue)
}
