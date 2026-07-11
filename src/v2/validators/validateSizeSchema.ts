import type { SizeSchema } from '../schemas/geometry'
import type { EditableSchema } from '../schemas/editable'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateNumber } from './validateNumber'

export const validateSizeSchema = (
  input: EditableSchema<SizeSchema>,
  context: ValidationContextSchema,
): ValidationResultSchema<EditableSchema<SizeSchema>, SizeSchema> => {
  const widthResult = validateNumber(input.width, context, { min: 0, minInclusive: false })
  const heightResult = validateNumber(input.height, context, { min: 0, minInclusive: false })
  const issues = {
    height: heightResult.issues,
    width: widthResult.issues,
  } satisfies ValidationIssuesSchema<EditableSchema<SizeSchema>>

  if (!widthResult.isValid || !heightResult.isValid) {
    return createInvalidValidationResult(issues)
  }

  return createValidValidationResult(issues, {
    height: heightResult.value,
    width: widthResult.value,
  })
}
