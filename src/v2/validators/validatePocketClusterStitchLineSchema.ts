import type { EditableSchema } from '../schemas/editable'
import type { PocketClusterStitchLineSchema, StitchDirectionSchema } from '../schemas/stitching'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateHexColor } from './validateHexColor'
import { validateName } from './validateName'
import { validateNumber } from './validateNumber'
import { validatePrimitiveUnion } from './validatePrimitiveUnion'

const stitchDirectionValues: Record<StitchDirectionSchema, boolean> = {
  'end-to-start': true,
  'start-to-end': true,
}

export const validatePocketClusterStitchLineSchema = (
  input: EditableSchema<PocketClusterStitchLineSchema>,
  currentValue: PocketClusterStitchLineSchema,
  context: ValidationContextSchema,
): ValidationResultSchema<PocketClusterStitchLineSchema> => {
  const nameResult = validateName(input.name, currentValue.name, input.id, context.project.stitchLines)
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
    { min: 0, minInclusive: false },
  )
  const stitchLineThicknessResult = validateNumber(
    input.stitchLineThickness,
    currentValue.stitchLineThickness,
    context,
    { min: 0, minInclusive: false },
  )
  const stitchHoleColorResult = validateHexColor(input.stitchHoleColor, currentValue.stitchHoleColor)
  const stitchLineColorResult = validateHexColor(input.stitchLineColor, currentValue.stitchLineColor)
  const startOffsetResult = validateNumber(input.startOffset, currentValue.startOffset, context)
  const endOffsetResult = validateNumber(input.endOffset, currentValue.endOffset, context)
  const stitchDirectionResult = validatePrimitiveUnion(
    input.stitchDirection,
    currentValue.stitchDirection,
    stitchDirectionValues,
  )

  const issues: ValidationIssuesSchema<PocketClusterStitchLineSchema> = {
    componentId: undefined,
    enabled: undefined,
    endOffset: endOffsetResult.issues,
    id: undefined,
    name: nameResult.issues,
    startOffset: startOffsetResult.issues,
    stitchDirection: stitchDirectionResult.issues,
    stitchHoleColor: stitchHoleColorResult.issues,
    stitchHoleDistance: stitchHoleDistanceResult.issues,
    stitchHoleLength: stitchHoleLengthResult.issues,
    stitchHoleThickness: stitchHoleThicknessResult.issues,
    stitchLineColor: stitchLineColorResult.issues,
    stitchLineThickness: stitchLineThicknessResult.issues,
    stitchMargin: stitchMarginResult.issues,
    type: undefined,
  }

  const committedValue: PocketClusterStitchLineSchema = {
    componentId: input.componentId,
    enabled: input.enabled,
    endOffset: endOffsetResult.committedValue,
    id: currentValue.id,
    name: nameResult.committedValue,
    startOffset: startOffsetResult.committedValue,
    stitchDirection: stitchDirectionResult.committedValue,
    stitchHoleColor: stitchHoleColorResult.committedValue,
    stitchHoleDistance: stitchHoleDistanceResult.committedValue,
    stitchHoleLength: stitchHoleLengthResult.committedValue,
    stitchHoleThickness: stitchHoleThicknessResult.committedValue,
    stitchLineColor: stitchLineColorResult.committedValue,
    stitchLineThickness: stitchLineThicknessResult.committedValue,
    stitchMargin: stitchMarginResult.committedValue,
    type: currentValue.type,
  }

  if (
    !nameResult.isValid ||
    !stitchMarginResult.isValid ||
    !stitchHoleLengthResult.isValid ||
    !stitchHoleDistanceResult.isValid ||
    !stitchHoleThicknessResult.isValid ||
    !stitchLineThicknessResult.isValid ||
    !stitchHoleColorResult.isValid ||
    !stitchLineColorResult.isValid ||
    !startOffsetResult.isValid ||
    !endOffsetResult.isValid ||
    !stitchDirectionResult.isValid
  ) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}
