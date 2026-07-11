import type { RootPanelSchema } from '../schemas/components'
import type { EditableSchema } from '../schemas/editable'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateBaseComponentSchema } from './validateBaseComponentSchema'
import { validateCornerRadiusValue } from './validateCornerRadiusSchema'
import { validateLayoutSchema } from './validateLayoutSchema'
import { validateSizeSchema } from './validateSizeSchema'

export const validateRootPanelSchema = (
  input: EditableSchema<RootPanelSchema>,
  currentValue: RootPanelSchema,
  context: ValidationContextSchema,
): ValidationResultSchema<EditableSchema<RootPanelSchema>, RootPanelSchema> => {
  const baseResult = validateBaseComponentSchema(input, currentValue, context)
  const layoutResult = validateLayoutSchema(input.layout, currentValue.layout, context)
  const radiusResult = validateCornerRadiusValue(input.radius, currentValue.radius, context)
  const sizeResult = validateSizeSchema(input.size, currentValue.size, context)
  const issues: ValidationIssuesSchema<EditableSchema<RootPanelSchema>> = {
    ...baseResult.issues,
    children: input.children.map(() => undefined),
    layout: layoutResult.issues,
    radius: radiusResult.issues,
    size: sizeResult.issues,
    type: undefined,
  }

  const committedValue: RootPanelSchema = {
    ...currentValue,
    color: baseResult.committedValue.color,
    layout: layoutResult.committedValue,
    name: baseResult.committedValue.name,
    radius: radiusResult.committedValue,
    size: sizeResult.committedValue,
  }

  if (!baseResult.isValid || !layoutResult.isValid || !radiusResult.isValid || !sizeResult.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(
    issues,
    {
      ...baseResult.value,
      children: currentValue.children,
      layout: layoutResult.value,
      radius: radiusResult.value,
      size: sizeResult.value,
      type: currentValue.type,
    },
    committedValue,
  )
}
