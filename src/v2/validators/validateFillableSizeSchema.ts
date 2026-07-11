import type { EditableSchema } from '../schemas/editable'
import type { FillableSizeSchema } from '../schemas/geometry'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateNumber } from './validateNumber'

export const validateFillableSizeSchema = (
  input: EditableSchema<FillableSizeSchema>,
  currentValue: FillableSizeSchema,
  context: ValidationContextSchema,
): ValidationResultSchema<EditableSchema<FillableSizeSchema>, FillableSizeSchema> => {
  const widthResult = validateFillableDimension(input.width, currentValue.width, context)
  const heightResult = validateFillableDimension(input.height, currentValue.height, context)
  const issues: ValidationIssuesSchema<EditableSchema<FillableSizeSchema>> = {
    height: heightResult.issues,
    width: widthResult.issues,
  }

  const committedValue: FillableSizeSchema = {
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

const validateFillableDimension = (
  input: string,
  currentValue: number | 'fill',
  context: ValidationContextSchema,
): ValidationResultSchema<string, number | 'fill'> => {
  if (input === 'fill') {
    return createValidValidationResult<string, 'fill'>(undefined, 'fill')
  }

  if (currentValue === 'fill') {
    const result = validateNumber(input, 0, context, { min: 0, minInclusive: false })

    if (!result.isValid) {
      return createInvalidValidationResult(result.issues, currentValue)
    }

    return result
  }

  return validateNumber(input, currentValue, context, { min: 0, minInclusive: false })
}
