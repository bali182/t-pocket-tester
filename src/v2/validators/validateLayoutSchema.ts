import type { LayoutOrderSchema, LayoutOrientationSchema, LayoutSchema } from '../schemas/components'
import type { EditableSchema } from '../schemas/editable'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateNumber } from './validateNumber'
import { validatePrimitiveUnion } from './validatePrimitiveUnion'

const layoutOrientationValues = {
  horizontal: true,
  vertical: true,
} satisfies Record<LayoutOrientationSchema, boolean>

const layoutOrderValues = {
  default: true,
  reverse: true,
} satisfies Record<LayoutOrderSchema, boolean>

export const validateLayoutSchema = (
  input: EditableSchema<LayoutSchema>,
  currentValue: LayoutSchema,
  context: ValidationContextSchema,
): ValidationResultSchema<EditableSchema<LayoutSchema>, LayoutSchema> => {
  const orientationResult = validatePrimitiveUnion(input.orientation, currentValue.orientation, layoutOrientationValues)
  const orderResult = validatePrimitiveUnion(input.order, currentValue.order, layoutOrderValues)
  const gapResult = validateNumber(input.gap, currentValue.gap, context, { min: 0 })
  const issues: ValidationIssuesSchema<EditableSchema<LayoutSchema>> = {
    gap: gapResult.issues,
    order: orderResult.issues,
    orientation: orientationResult.issues,
  }

  const committedValue: LayoutSchema = {
    gap: gapResult.committedValue,
    order: orderResult.committedValue,
    orientation: orientationResult.committedValue,
  }

  if (!orientationResult.isValid || !orderResult.isValid || !gapResult.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(
    issues,
    {
      gap: gapResult.value,
      order: orderResult.value,
      orientation: orientationResult.value,
    },
    committedValue,
  )
}
