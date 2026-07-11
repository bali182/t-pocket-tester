import type { LayoutOrderSchema, LayoutOrientationSchema, LayoutSchema } from '../schemas/components'
import type { EditableSchema } from '../schemas/editable'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { isDefined } from '../utils/isDefined'
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
  context: ValidationContextSchema,
): ValidationResultSchema<EditableSchema<LayoutSchema>, LayoutSchema> => {
  const orientationResult = validatePrimitiveUnion(input.orientation, layoutOrientationValues)
  const orderResult = validatePrimitiveUnion(input.order, layoutOrderValues)
  const gapResult = validateNumber(input.gap, context, { min: 0 })
  const issues = {
    gap: gapResult.issues,
    order: orderResult.issues,
    orientation: orientationResult.issues,
  } satisfies ValidationIssuesSchema<EditableSchema<LayoutSchema>>

  if (
    !orientationResult.isValid ||
    !isDefined(orientationResult.value) ||
    !orderResult.isValid ||
    !isDefined(orderResult.value) ||
    !gapResult.isValid
  ) {
    return createInvalidValidationResult(issues)
  }

  return createValidValidationResult(issues, {
    gap: gapResult.value,
    order: orderResult.value,
    orientation: orientationResult.value,
  })
}
