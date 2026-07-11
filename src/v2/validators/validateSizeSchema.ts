import type { EditableSchema } from '../schemas/editable'
import type { SizeSchema } from '../schemas/geometry'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateNumber } from './validateNumber'

export const validateSizeSchema = (
  input: EditableSchema<SizeSchema>,
  currentValue: SizeSchema,
  context: ValidationContextSchema,
): ValidationResultSchema<EditableSchema<SizeSchema>, SizeSchema> => {
  const widthResult = validateNumber(input.width, currentValue.width, context, { min: 0, minInclusive: false })
  const heightResult = validateNumber(input.height, currentValue.height, context, { min: 0, minInclusive: false })
  const issues: ValidationIssuesSchema<EditableSchema<SizeSchema>> = {
    height: heightResult.issues,
    width: widthResult.issues,
  }

  const committedValue: SizeSchema = {
    height: heightResult.committedValue,
    width: widthResult.committedValue,
  }

  if (!widthResult.isValid || !heightResult.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(
    issues,
    {
      height: heightResult.value,
      width: widthResult.value,
    },
    committedValue,
  )
}
