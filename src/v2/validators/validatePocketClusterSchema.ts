import type { PocketClusterSchema, PocketOrientationSchema } from '../schemas/components'
import type { EditableSchema } from '../schemas/editable'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateHexColor } from './validateHexColor'
import { validateName } from './validateName'
import { validateNumber } from './validateNumber'
import { validatePrimitiveUnion } from './validatePrimitiveUnion'

const pocketOrientationValues: Record<PocketOrientationSchema, boolean> = {
  down: true,
  left: true,
  right: true,
  up: true,
}

export const validatePocketClusterSchema = (
  input: EditableSchema<PocketClusterSchema>,
  currentValue: PocketClusterSchema,
  context: ValidationContextSchema,
): ValidationResultSchema<EditableSchema<PocketClusterSchema>, PocketClusterSchema> => {
  const nameResult = validateName(input.name, currentValue.name, input.id, context)
  const colorResult = validateHexColor(input.color, currentValue.color)
  const borderRadiusResult = validateNumber(input.borderRadius, currentValue.borderRadius, context, { min: 0 })
  const topLeftRadiusResult = validateNumber(input.topLeftRadius, currentValue.topLeftRadius, context, { min: 0 })
  const topRightRadiusResult = validateNumber(input.topRightRadius, currentValue.topRightRadius, context, { min: 0 })
  const bottomLeftRadiusResult = validateNumber(
    input.bottomLeftRadius,
    currentValue.bottomLeftRadius,
    context,
    { min: 0 },
  )
  const bottomRightRadiusResult = validateNumber(
    input.bottomRightRadius,
    currentValue.bottomRightRadius,
    context,
    { min: 0 },
  )
  const widthResult = validateNumber(input.width, currentValue.width, context, { min: 0, minInclusive: false })
  const heightResult = validateNumber(input.height, currentValue.height, context, { min: 0, minInclusive: false })
  const orientationResult = validatePrimitiveUnion(input.orientation, currentValue.orientation, pocketOrientationValues)
  const pocketCountResult = validateNumber(input.pocketCount, currentValue.pocketCount, context, {
    allowFraction: false,
    min: 1,
  })
  const pocketStepResult = validateNumber(input.pocketStep, currentValue.pocketStep, context, {
    min: 0,
    minInclusive: false,
  })
  const tPocketTabWidthResult = validateNumber(input.tPocketTabWidth, currentValue.tPocketTabWidth, context, {
    min: 0,
    minInclusive: false,
  })
  const tPocketTaperResult = validateNumber(input.tPocketTaper, currentValue.tPocketTaper, context, {
    min: 0,
    minInclusive: false,
  })
  const issues: ValidationIssuesSchema<EditableSchema<PocketClusterSchema>> = {
    autoHeight: undefined,
    autoWidth: undefined,
    borderRadius: borderRadiusResult.issues,
    bottomLeftRadius: bottomLeftRadiusResult.issues,
    bottomRightRadius: bottomRightRadiusResult.issues,
    color: colorResult.issues,
    height: heightResult.issues,
    id: undefined,
    individualRadii: undefined,
    name: nameResult.issues,
    orientation: orientationResult.issues,
    pocketCount: pocketCountResult.issues,
    pocketStep: pocketStepResult.issues,
    tPocketTabWidth: tPocketTabWidthResult.issues,
    tPocketTaper: tPocketTaperResult.issues,
    topLeftRadius: topLeftRadiusResult.issues,
    topRightRadius: topRightRadiusResult.issues,
    type: undefined,
    width: widthResult.issues,
  }

  const committedValue: PocketClusterSchema = {
    autoHeight: input.autoHeight,
    autoWidth: input.autoWidth,
    borderRadius: borderRadiusResult.committedValue,
    bottomLeftRadius: bottomLeftRadiusResult.committedValue,
    bottomRightRadius: bottomRightRadiusResult.committedValue,
    color: colorResult.committedValue,
    height: heightResult.committedValue,
    id: currentValue.id,
    individualRadii: input.individualRadii,
    name: nameResult.committedValue,
    orientation: orientationResult.committedValue,
    pocketCount: pocketCountResult.committedValue,
    pocketStep: pocketStepResult.committedValue,
    tPocketTabWidth: tPocketTabWidthResult.committedValue,
    tPocketTaper: tPocketTaperResult.committedValue,
    topLeftRadius: topLeftRadiusResult.committedValue,
    topRightRadius: topRightRadiusResult.committedValue,
    type: currentValue.type,
    width: widthResult.committedValue,
  }

  if (
    !nameResult.isValid ||
    !colorResult.isValid ||
    !borderRadiusResult.isValid ||
    !topLeftRadiusResult.isValid ||
    !topRightRadiusResult.isValid ||
    !bottomLeftRadiusResult.isValid ||
    !bottomRightRadiusResult.isValid ||
    !widthResult.isValid ||
    !heightResult.isValid ||
    !orientationResult.isValid ||
    !pocketCountResult.isValid ||
    !pocketStepResult.isValid ||
    !tPocketTabWidthResult.isValid ||
    !tPocketTaperResult.isValid
  ) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(
    issues,
    {
      autoHeight: input.autoHeight,
      autoWidth: input.autoWidth,
      borderRadius: borderRadiusResult.value,
      bottomLeftRadius: bottomLeftRadiusResult.value,
      bottomRightRadius: bottomRightRadiusResult.value,
      color: colorResult.value,
      height: heightResult.value,
      id: currentValue.id,
      individualRadii: input.individualRadii,
      name: nameResult.value,
      orientation: orientationResult.value,
      pocketCount: pocketCountResult.value,
      pocketStep: pocketStepResult.value,
      tPocketTabWidth: tPocketTabWidthResult.value,
      tPocketTaper: tPocketTaperResult.value,
      topLeftRadius: topLeftRadiusResult.value,
      topRightRadius: topRightRadiusResult.value,
      type: currentValue.type,
      width: widthResult.value,
    },
    committedValue,
  )
}
