import type { CornerRadiusSchema } from '../schemas/components'
import type { EditableSchema } from '../schemas/editable'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateNumber } from './validateNumber'

export const validateCornerRadiusSchema = (
  input: EditableSchema<CornerRadiusSchema>,
  currentValue: CornerRadiusSchema,
  context: ValidationContextSchema,
): ValidationResultSchema<EditableSchema<CornerRadiusSchema>, CornerRadiusSchema> => {
  const topLeftResult = validateNumber(input.topLeft, currentValue.topLeft, context, { min: 0 })
  const topRightResult = validateNumber(input.topRight, currentValue.topRight, context, { min: 0 })
  const bottomLeftResult = validateNumber(input.bottomLeft, currentValue.bottomLeft, context, { min: 0 })
  const bottomRightResult = validateNumber(input.bottomRight, currentValue.bottomRight, context, { min: 0 })
  const issues: ValidationIssuesSchema<EditableSchema<CornerRadiusSchema>> = {
    bottomLeft: bottomLeftResult.issues,
    bottomRight: bottomRightResult.issues,
    topLeft: topLeftResult.issues,
    topRight: topRightResult.issues,
  }

  const committedValue: CornerRadiusSchema = {
    bottomLeft: bottomLeftResult.committedValue,
    bottomRight: bottomRightResult.committedValue,
    topLeft: topLeftResult.committedValue,
    topRight: topRightResult.committedValue,
  }

  if (!topLeftResult.isValid || !topRightResult.isValid || !bottomLeftResult.isValid || !bottomRightResult.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(
    issues,
    {
      bottomLeft: bottomLeftResult.value,
      bottomRight: bottomRightResult.value,
      topLeft: topLeftResult.value,
      topRight: topRightResult.value,
    },
    committedValue,
  )
}

export const validateCornerRadiusValue = (
  input: EditableSchema<number | CornerRadiusSchema>,
  currentValue: number | CornerRadiusSchema,
  context: ValidationContextSchema,
): ValidationResultSchema<EditableSchema<number | CornerRadiusSchema>, number | CornerRadiusSchema> => {
  if (typeof input === 'string') {
    const result = validateNumber(
      input,
      typeof currentValue === 'number' ? currentValue : currentValue.topLeft,
      context,
      { min: 0 },
    )

    if (!result.isValid && typeof currentValue !== 'number') {
      return createInvalidValidationResult(result.issues, currentValue)
    }

    return result
  }

  if (typeof currentValue !== 'number') {
    return validateCornerRadiusSchema(input, currentValue, context)
  }

  const currentCornerRadius: CornerRadiusSchema = {
    bottomLeft: currentValue,
    bottomRight: currentValue,
    topLeft: currentValue,
    topRight: currentValue,
  }
  const result = validateCornerRadiusSchema(input, currentCornerRadius, context)

  if (!result.isValid) {
    return createInvalidValidationResult(result.issues, currentValue)
  }

  return result
}
