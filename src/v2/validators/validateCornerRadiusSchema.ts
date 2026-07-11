import type { CornerRadiusSchema } from '../schemas/components'
import type { EditableSchema } from '../schemas/editable'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateNumber } from './validateNumber'

export const validateCornerRadiusSchema = (
  input: EditableSchema<CornerRadiusSchema>,
  context: ValidationContextSchema,
): ValidationResultSchema<EditableSchema<CornerRadiusSchema>, CornerRadiusSchema> => {
  const topLeftResult = validateNumber(input.topLeft, context, { min: 0 })
  const topRightResult = validateNumber(input.topRight, context, { min: 0 })
  const bottomLeftResult = validateNumber(input.bottomLeft, context, { min: 0 })
  const bottomRightResult = validateNumber(input.bottomRight, context, { min: 0 })
  const issues = {
    bottomLeft: bottomLeftResult.issues,
    bottomRight: bottomRightResult.issues,
    topLeft: topLeftResult.issues,
    topRight: topRightResult.issues,
  } satisfies ValidationIssuesSchema<EditableSchema<CornerRadiusSchema>>

  if (!topLeftResult.isValid || !topRightResult.isValid || !bottomLeftResult.isValid || !bottomRightResult.isValid) {
    return createInvalidValidationResult(issues)
  }

  return createValidValidationResult(issues, {
    bottomLeft: bottomLeftResult.value,
    bottomRight: bottomRightResult.value,
    topLeft: topLeftResult.value,
    topRight: topRightResult.value,
  })
}

export const validateCornerRadiusValue = (
  input: EditableSchema<number | CornerRadiusSchema>,
  context: ValidationContextSchema,
): ValidationResultSchema<EditableSchema<number | CornerRadiusSchema>, number | CornerRadiusSchema> => {
  if (typeof input === 'string') {
    return validateNumber(input, context, { min: 0 })
  }

  return validateCornerRadiusSchema(input, context)
}
