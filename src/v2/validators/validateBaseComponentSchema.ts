import type { BaseComponentSchema } from '../schemas/components'
import type { EditableSchema } from '../schemas/editable'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateHexColor } from './validateHexColor'
import { validateName } from './validateName'

export const validateBaseComponentSchema = (
  input: EditableSchema<BaseComponentSchema>,
  currentValue: BaseComponentSchema,
  context: ValidationContextSchema,
): ValidationResultSchema<EditableSchema<BaseComponentSchema>, BaseComponentSchema> => {
  const nameResult = validateName(input.name, currentValue.name, input.id, context)
  const colorResult = validateHexColor(input.color, currentValue.color)
  const issues: ValidationIssuesSchema<EditableSchema<BaseComponentSchema>> = {
    color: colorResult.issues,
    id: undefined,
    name: nameResult.issues,
  }

  const committedValue: BaseComponentSchema = {
    ...currentValue,
    color: colorResult.committedValue,
    name: nameResult.committedValue,
  }

  if (!nameResult.isValid || !colorResult.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(
    issues,
    {
      color: colorResult.value,
      id: currentValue.id,
      name: nameResult.value,
    },
    committedValue,
  )
}
