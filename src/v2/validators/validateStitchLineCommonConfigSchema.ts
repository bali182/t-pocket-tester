import type { EditableSchema } from '../schemas/editable'
import type { StitchLineCommonConfigSchema } from '../schemas/stitching'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { isDefined } from '../utils/isDefined'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateHexColor } from './validateHexColor'
import { validateNumber } from './validateNumber'

type StitchLineCommonConfigOverridesSchema = Partial<StitchLineCommonConfigSchema>

export const validateStitchLineCommonConfigSchema = (
  editableStitchLine: EditableSchema<StitchLineCommonConfigOverridesSchema>,
  currentStitchLine: StitchLineCommonConfigOverridesSchema,
  context: ValidationContextSchema,
): ValidationResultSchema<StitchLineCommonConfigOverridesSchema> => {
  const resolvedCurrentSettings = {
    ...context.project.stitchingSettings,
    ...currentStitchLine,
  }
  const stitchMarginResult = validateOptionalValue(
    editableStitchLine.stitchMargin,
    currentStitchLine.stitchMargin,
    (editedValue) => validateNumber(editedValue, resolvedCurrentSettings.stitchMargin, context, { min: 2 }),
  )
  const stitchHoleLengthResult = validateOptionalValue(
    editableStitchLine.stitchHoleLength,
    currentStitchLine.stitchHoleLength,
    (editedValue) =>
      validateNumber(editedValue, resolvedCurrentSettings.stitchHoleLength, context, { min: 0, minInclusive: false }),
  )
  const stitchHoleDistanceResult = validateOptionalValue(
    editableStitchLine.stitchHoleDistance,
    currentStitchLine.stitchHoleDistance,
    (editedValue) => validateNumber(editedValue, resolvedCurrentSettings.stitchHoleDistance, context, { min: 1 }),
  )
  const stitchHoleThicknessResult = validateOptionalValue(
    editableStitchLine.stitchHoleThickness,
    currentStitchLine.stitchHoleThickness,
    (editedValue) =>
      validateNumber(editedValue, resolvedCurrentSettings.stitchHoleThickness, context, { min: 0, minInclusive: false }),
  )
  const stitchLineThicknessResult = validateOptionalValue(
    editableStitchLine.stitchLineThickness,
    currentStitchLine.stitchLineThickness,
    (editedValue) =>
      validateNumber(editedValue, resolvedCurrentSettings.stitchLineThickness, context, { min: 0, minInclusive: false }),
  )
  const stitchHoleColorResult = validateOptionalValue(
    editableStitchLine.stitchHoleColor,
    currentStitchLine.stitchHoleColor,
    (editedValue) => validateHexColor(editedValue, resolvedCurrentSettings.stitchHoleColor, context),
  )
  const stitchLineColorResult = validateOptionalValue(
    editableStitchLine.stitchLineColor,
    currentStitchLine.stitchLineColor,
    (editedValue) => validateHexColor(editedValue, resolvedCurrentSettings.stitchLineColor, context),
  )
  const issues: ValidationIssuesSchema<StitchLineCommonConfigOverridesSchema> = {
    stitchHoleColor: stitchHoleColorResult.issues,
    stitchHoleDistance: stitchHoleDistanceResult.issues,
    stitchHoleLength: stitchHoleLengthResult.issues,
    stitchHoleThickness: stitchHoleThicknessResult.issues,
    stitchLineColor: stitchLineColorResult.issues,
    stitchLineThickness: stitchLineThicknessResult.issues,
    stitchMargin: stitchMarginResult.issues,
  }
  const committedValue: StitchLineCommonConfigOverridesSchema = {}

  if (isDefined(stitchMarginResult.committedValue)) {
    committedValue.stitchMargin = stitchMarginResult.committedValue
  }
  if (isDefined(stitchHoleLengthResult.committedValue)) {
    committedValue.stitchHoleLength = stitchHoleLengthResult.committedValue
  }
  if (isDefined(stitchHoleDistanceResult.committedValue)) {
    committedValue.stitchHoleDistance = stitchHoleDistanceResult.committedValue
  }
  if (isDefined(stitchHoleThicknessResult.committedValue)) {
    committedValue.stitchHoleThickness = stitchHoleThicknessResult.committedValue
  }
  if (isDefined(stitchLineThicknessResult.committedValue)) {
    committedValue.stitchLineThickness = stitchLineThicknessResult.committedValue
  }
  if (isDefined(stitchHoleColorResult.committedValue)) {
    committedValue.stitchHoleColor = stitchHoleColorResult.committedValue
  }
  if (isDefined(stitchLineColorResult.committedValue)) {
    committedValue.stitchLineColor = stitchLineColorResult.committedValue
  }

  if (
    !stitchMarginResult.isValid ||
    !stitchHoleLengthResult.isValid ||
    !stitchHoleDistanceResult.isValid ||
    !stitchHoleThicknessResult.isValid ||
    !stitchLineThicknessResult.isValid ||
    !stitchHoleColorResult.isValid ||
    !stitchLineColorResult.isValid
  ) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}

const validateOptionalValue = <T>(
  editedValue: string | undefined,
  previouslyStoredValue: T | undefined,
  validateEditedValue: (editedValue: string) => ValidationResultSchema<T>,
): ValidationResultSchema<T | undefined> => {
  if (!isDefined(editedValue)) {
    return createValidValidationResult(undefined, undefined)
  }

  const result = validateEditedValue(editedValue)

  if (result.isValid) {
    return createValidValidationResult(result.issues, result.committedValue)
  }

  return createInvalidValidationResult(result.issues, previouslyStoredValue)
}
