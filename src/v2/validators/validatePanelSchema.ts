import type { PanelSchema } from '../schemas/components'
import type { EditableSchema } from '../schemas/editable'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateBaseComponentSchema } from './validateBaseComponentSchema'
import { validateCornerRadiusValue } from './validateCornerRadiusSchema'
import { validateLayoutSchema } from './validateLayoutSchema'
import { validateFillableSizeSchema } from './validateFillableSizeSchema'

export const validatePanelSchema = (
  input: EditableSchema<PanelSchema>,
  context: ValidationContextSchema,
): ValidationResultSchema<EditableSchema<PanelSchema>, PanelSchema> => {
  const baseResult = validateBaseComponentSchema(input, context)
  const layoutResult = validateLayoutSchema(input.layout, context)
  const radiusResult = validateCornerRadiusValue(input.radius, context)
  const sizeResult = validateFillableSizeSchema(input.size, context)
  const issues = {
    ...baseResult.issues,
    children: input.children.map(() => undefined),
    layout: layoutResult.issues,
    radius: radiusResult.issues,
    size: sizeResult.issues,
    type: undefined,
  } satisfies ValidationIssuesSchema<EditableSchema<PanelSchema>>

  if (!baseResult.isValid || !layoutResult.isValid || !radiusResult.isValid || !sizeResult.isValid) {
    return createInvalidValidationResult(issues)
  }

  return createValidValidationResult(issues, {
    ...baseResult.value,
    children: input.children,
    layout: layoutResult.value,
    radius: radiusResult.value,
    size: sizeResult.value,
    type: input.type,
  })
}
