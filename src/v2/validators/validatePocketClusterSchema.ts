import type { PocketClusterSchema, PocketOrientationSchema } from '../schemas/components'
import type { EditableSchema } from '../schemas/editable'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
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
  currentValue: PocketClusterSchema,
  context: ValidationContextSchema,
): ValidationResultSchema<EditableSchema<PocketClusterSchema>, PocketClusterSchema> => {
  const baseResult = validateBaseComponentSchema(input, currentValue, context)
  const radiusResult = validateCornerRadiusValue(input.radius, currentValue.radius, context)
  const sizeResult = validateFillableSizeSchema(input.size, currentValue.size, context)
  const pocketCountResult = validateNumber(input.pocketCount, currentValue.pocketCount, context, {
    allowFraction: false,
    min: 1,
  })
  const pocketStepResult = validateNumber(input.pocketStep, currentValue.pocketStep, context, {
    min: 0,
    minInclusive: false,
  })
  const orientationResult = validatePrimitiveUnion(input.orientation, currentValue.orientation, pocketOrientationValues)
  const tPocketTabWidthResult = validateNumber(input.tPocketTabWidth, currentValue.tPocketTabWidth, context, {
    min: 0,
    minInclusive: false,
  })
  const tPocketTaperResult = validateNumber(input.tPocketTaper, currentValue.tPocketTaper, context, {
    min: 0,
    minInclusive: false,
  })
  const pocketRadiusResult = validateNumber(input.pocketRadius, currentValue.pocketRadius, context, {
    min: 0,
    minInclusive: false,
  })
  const issues: ValidationIssuesSchema<EditableSchema<PocketClusterSchema>> = {
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
  }

  const committedValue: PocketClusterSchema = {
    ...currentValue,
    color: baseResult.committedValue.color,
    name: baseResult.committedValue.name,
    orientation: orientationResult.committedValue,
    pocketCount: pocketCountResult.committedValue,
    pocketRadius: pocketRadiusResult.committedValue,
    pocketStep: pocketStepResult.committedValue,
    radius: radiusResult.committedValue,
    size: sizeResult.committedValue,
    tPocketTabWidth: tPocketTabWidthResult.committedValue,
    tPocketTaper: tPocketTaperResult.committedValue,
  }

  if (
    !baseResult.isValid ||
    !radiusResult.isValid ||
    !sizeResult.isValid ||
    !pocketCountResult.isValid ||
    !pocketStepResult.isValid ||
    !orientationResult.isValid ||
    !tPocketTabWidthResult.isValid ||
    !tPocketTaperResult.isValid ||
    !pocketRadiusResult.isValid
  ) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(
    issues,
    {
      ...baseResult.value,
      orientation: orientationResult.value,
      pocketCount: pocketCountResult.value,
      pocketRadius: pocketRadiusResult.value,
      pocketStep: pocketStepResult.value,
      radius: radiusResult.value,
      size: sizeResult.value,
      tPocketTabWidth: tPocketTabWidthResult.value,
      tPocketTaper: tPocketTaperResult.value,
      type: currentValue.type,
    },
    committedValue,
  )
}
