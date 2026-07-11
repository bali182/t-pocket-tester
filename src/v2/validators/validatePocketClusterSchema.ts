import type { PocketClusterSchema, PocketOrientationSchema } from '../schemas/components'
import type { EditableSchema } from '../schemas/editable'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { isDefined } from '../utils/isDefined'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateBaseComponentSchema } from './validateBaseComponentSchema'
import { validateCornerRadiusValue } from './validateCornerRadiusSchema'
import { validateFillableSizeSchema } from './validateFillableSizeSchema'
import { validateNumber } from './validateNumber'
import { validatePrimitiveUnion } from './validatePrimitiveUnion'

const pocketOrientationValues = {
  down: true,
  left: true,
  right: true,
  up: true,
} satisfies Record<PocketOrientationSchema, boolean>

export const validatePocketClusterSchema = (
  input: EditableSchema<PocketClusterSchema>,
  context: ValidationContextSchema,
): ValidationResultSchema<EditableSchema<PocketClusterSchema>, PocketClusterSchema> => {
  const baseResult = validateBaseComponentSchema(input, context)
  const radiusResult = validateCornerRadiusValue(input.radius, context)
  const sizeResult = validateFillableSizeSchema(input.size, context)
  const pocketCountResult = validateNumber(input.pocketCount, context, { allowFraction: false, min: 1 })
  const pocketStepResult = validateNumber(input.pocketStep, context, { min: 0, minInclusive: false })
  const orientationResult = validatePrimitiveUnion(input.orientation, pocketOrientationValues)
  const tPocketTabWidthResult = validateNumber(input.tPocketTabWidth, context, { min: 0, minInclusive: false })
  const tPocketTaperResult = validateNumber(input.tPocketTaper, context, { min: 0, minInclusive: false })
  const pocketRadiusResult = validateNumber(input.pocketRadius, context, { min: 0, minInclusive: false })
  const issues = {
    ...baseResult.issues,
    orientation: orientationResult.issues,
    pocketCount: pocketCountResult.issues,
    pocketRadius: pocketRadiusResult.issues,
    pocketStep: pocketStepResult.issues,
    radius: radiusResult.issues,
    size: sizeResult.issues,
    tPocketTabWidth: tPocketTabWidthResult.issues,
    tPocketTaper: tPocketTaperResult.issues,
    type: undefined,
  } satisfies ValidationIssuesSchema<EditableSchema<PocketClusterSchema>>

  if (
    !baseResult.isValid ||
    !radiusResult.isValid ||
    !sizeResult.isValid ||
    !pocketCountResult.isValid ||
    !pocketStepResult.isValid ||
    !orientationResult.isValid ||
    !isDefined(orientationResult.value) ||
    !tPocketTabWidthResult.isValid ||
    !tPocketTaperResult.isValid ||
    !pocketRadiusResult.isValid
  ) {
    return createInvalidValidationResult(issues)
  }

  return createValidValidationResult(issues, {
    ...baseResult.value,
    orientation: orientationResult.value,
    pocketCount: pocketCountResult.value,
    pocketRadius: pocketRadiusResult.value,
    pocketStep: pocketStepResult.value,
    radius: radiusResult.value,
    size: sizeResult.value,
    tPocketTabWidth: tPocketTabWidthResult.value,
    tPocketTaper: tPocketTaperResult.value,
    type: input.type,
  })
}
