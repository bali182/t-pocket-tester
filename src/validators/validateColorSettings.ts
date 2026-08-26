import type { EditableSchema } from '../schemas/editable'
import type { ColorSettingsSchema } from '../schemas/settings'
import type { BaseValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateHexColor } from './validateHexColor'

export const validateColorSettings = (
  input: EditableSchema<ColorSettingsSchema>,
  currentValue: ColorSettingsSchema,
  context: BaseValidationContextSchema,
): ValidationResultSchema<ColorSettingsSchema> => {
  const leatherColorResult = validateHexColor(input.leatherColor, currentValue.leatherColor, context)
  const stitchHoleColorResult = validateHexColor(input.stitchHoleColor, currentValue.stitchHoleColor, context)
  const stitchLineColorResult = validateHexColor(input.stitchLineColor, currentValue.stitchLineColor, context)
  const strokeColorResult = validateHexColor(input.strokeColor, currentValue.strokeColor, context)
  const selectionColorResult = validateHexColor(input.selectionColor, currentValue.selectionColor, context)
  const cardColorResult = validateHexColor(input.cardColor, currentValue.cardColor, context)
  const issues: ValidationIssuesSchema<ColorSettingsSchema> = {
    cardColor: cardColorResult.issues,
    leatherColor: leatherColorResult.issues,
    selectionColor: selectionColorResult.issues,
    stitchHoleColor: stitchHoleColorResult.issues,
    stitchLineColor: stitchLineColorResult.issues,
    strokeColor: strokeColorResult.issues,
  }
  const committedValue: ColorSettingsSchema = {
    cardColor: cardColorResult.committedValue,
    leatherColor: leatherColorResult.committedValue,
    selectionColor: selectionColorResult.committedValue,
    stitchHoleColor: stitchHoleColorResult.committedValue,
    stitchLineColor: stitchLineColorResult.committedValue,
    strokeColor: strokeColorResult.committedValue,
  }

  if (
    !leatherColorResult.isValid ||
    !stitchHoleColorResult.isValid ||
    !stitchLineColorResult.isValid ||
    !strokeColorResult.isValid ||
    !selectionColorResult.isValid ||
    !cardColorResult.isValid
  ) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}
