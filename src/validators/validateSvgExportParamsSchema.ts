import type { EditableSchema } from '../schemas/editable'
import type { BaseValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import type { SvgExportParamsSchema } from '../schemas/svgExport'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateNumber } from './validateNumber'

export const validateSvgExportParamsSchema = (
  input: EditableSchema<SvgExportParamsSchema>,
  currentValue: SvgExportParamsSchema,
  context: BaseValidationContextSchema,
): ValidationResultSchema<SvgExportParamsSchema> => {
  const gapResult = validateNumber(input.gap, currentValue.gap, context, { min: 0 })
  const paddingResult = validateNumber(input.padding, currentValue.padding, context, { min: 0 })

  const issues: ValidationIssuesSchema<SvgExportParamsSchema> = {
    gap: gapResult.issues,
    padding: paddingResult.issues,
    stitchLineMode: undefined,
    showNames: undefined,
    showDimensions: undefined,
    childMarkers: undefined,
  }
  const committedValue: SvgExportParamsSchema = {
    gap: gapResult.committedValue,
    padding: paddingResult.committedValue,
    stitchLineMode: input.stitchLineMode,
    showNames: input.showNames,
    showDimensions: input.showDimensions,
    childMarkers: input.childMarkers,
  }

  if (!gapResult.isValid || !paddingResult.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}
