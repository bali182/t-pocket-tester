import type { EditableSchema } from '../schemas/editable'
import type { StitchLineCommonConfigSchema } from '../schemas/stitching'
import type { BaseValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateNumber } from './validateNumber'

export const validateStitchLineCommonConfigSchema = (
  input: EditableSchema<StitchLineCommonConfigSchema>,
  currentValue: StitchLineCommonConfigSchema,
  context: BaseValidationContextSchema,
): ValidationResultSchema<StitchLineCommonConfigSchema> => {
  const stitchMarginResult = validateNumber(input.stitchMargin, currentValue.stitchMargin, context, { min: 2 })
  const stitchHoleLengthResult = validateNumber(input.stitchHoleLength, currentValue.stitchHoleLength, context, {
    min: 0,
    minInclusive: false,
  })
  const stitchHoleDistanceResult = validateNumber(input.stitchHoleDistance, currentValue.stitchHoleDistance, context, {
    min: 1,
  })
  const stitchHoleThicknessResult = validateNumber(
    input.stitchHoleThickness,
    currentValue.stitchHoleThickness,
    context,
    {
      min: 0,
      minInclusive: false,
    },
  )
  const stitchLineThicknessResult = validateNumber(
    input.stitchLineThickness,
    currentValue.stitchLineThickness,
    context,
    {
      min: 0,
      minInclusive: false,
    },
  )

  const issues: ValidationIssuesSchema<StitchLineCommonConfigSchema> = {
    stitchHoleDistance: stitchHoleDistanceResult.issues,
    stitchHoleLength: stitchHoleLengthResult.issues,
    stitchHoleThickness: stitchHoleThicknessResult.issues,
    stitchLineThickness: stitchLineThicknessResult.issues,
    stitchMargin: stitchMarginResult.issues,
    stitchLinesVisible: undefined,
    stitchHolesVisible: undefined,
    stitchesVisible: undefined,
  }
  const committedValue: StitchLineCommonConfigSchema = {
    stitchHoleDistance: stitchHoleDistanceResult.committedValue,
    stitchHoleLength: stitchHoleLengthResult.committedValue,
    stitchHoleThickness: stitchHoleThicknessResult.committedValue,
    stitchLineThickness: stitchLineThicknessResult.committedValue,
    stitchMargin: stitchMarginResult.committedValue,
    stitchLinesVisible: input.stitchLinesVisible,
    stitchHolesVisible: input.stitchHolesVisible,
    stitchesVisible: input.stitchesVisible,
  }

  if (
    !stitchMarginResult.isValid ||
    !stitchHoleLengthResult.isValid ||
    !stitchHoleDistanceResult.isValid ||
    !stitchHoleThicknessResult.isValid ||
    !stitchLineThicknessResult.isValid
  ) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}
