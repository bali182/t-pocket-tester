import type { EditableSchema } from '../schemas/editable'
import type { FillableSizeSchema } from '../schemas/geometry'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateNumber } from './validateNumber'

export const validateFillableSizeSchema = (
  input: EditableSchema<FillableSizeSchema>,
  context: ValidationContextSchema,
): ValidationResultSchema<EditableSchema<FillableSizeSchema>, FillableSizeSchema> => {
  const widthResult = validateFillableDimension(input.width, context)
  const heightResult = validateFillableDimension(input.height, context)
  const issues = {
    height: heightResult.issues,
    width: widthResult.issues,
  } satisfies ValidationIssuesSchema<EditableSchema<FillableSizeSchema>>

  if (!widthResult.isValid || !heightResult.isValid) {
    return createInvalidValidationResult(issues)
  }

  return createValidValidationResult(issues, {
    height: heightResult.value,
    width: widthResult.value,
  })
}

const validateFillableDimension = (
  input: string,
  context: ValidationContextSchema,
): ValidationResultSchema<string, number | 'fill'> => {
  if (input === 'fill') {
    return createValidValidationResult<string, 'fill'>(undefined, 'fill')
  }

  return validateNumber(input, context, { min: 0, minInclusive: false })
}
