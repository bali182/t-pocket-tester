import type { BaseComponentSchema } from '../schemas/components'
import type { EditableSchema } from '../schemas/editable'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateHexColor } from './validateHexColor'
import { validateName } from './validateName'

export const validateBaseComponentSchema = (
  input: EditableSchema<BaseComponentSchema>,
  context: ValidationContextSchema,
): ValidationResultSchema<EditableSchema<BaseComponentSchema>, BaseComponentSchema> => {
  const nameResult = validateName(input.name, input.id, context)
  const colorResult = validateHexColor(input.color)
  const issues = {
    color: colorResult.issues,
    id: undefined,
    name: nameResult.issues,
  } satisfies ValidationIssuesSchema<EditableSchema<BaseComponentSchema>>

  if (!nameResult.isValid || !colorResult.isValid) {
    return createInvalidValidationResult(issues)
  }

  return createValidValidationResult(issues, {
    color: colorResult.value,
    id: input.id,
    name: nameResult.value,
  })
}
