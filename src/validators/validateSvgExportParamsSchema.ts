import type { EditableSchema } from '../schemas/editable'
import { BaseExportSettingsSchema } from '../schemas/settings'
import type { BaseValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateNumber } from './validateNumber'

export const validateSvgExportParamsSchema = (
  input: EditableSchema<BaseExportSettingsSchema>,
  currentValue: BaseExportSettingsSchema,
  context: BaseValidationContextSchema,
): ValidationResultSchema<BaseExportSettingsSchema> => {
  const gapResult = validateNumber(input.gap, currentValue.gap, context, { min: 0 })
  const paddingResult = validateNumber(input.padding, currentValue.padding, context, { min: 0 })
  const cutHelperDistanceResult = validateNumber(input.cutHelperDistance, currentValue.cutHelperDistance, context, {
    min: 0,
  })

  const issues: ValidationIssuesSchema<BaseExportSettingsSchema> = {
    gap: gapResult.issues,
    padding: paddingResult.issues,
    cutHelperDistance: cutHelperDistanceResult.issues,
    stitchLineMode: undefined,
    showNames: undefined,
    showDimensions: undefined,
    childMarkers: undefined,
  }
  const committedValue: BaseExportSettingsSchema = {
    gap: gapResult.committedValue,
    padding: paddingResult.committedValue,
    cutHelperDistance: cutHelperDistanceResult.committedValue,
    stitchLineMode: input.stitchLineMode,
    showNames: input.showNames,
    showDimensions: input.showDimensions,
    childMarkers: input.childMarkers,
  }

  if (!gapResult.isValid || !paddingResult.isValid || !cutHelperDistanceResult.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}
