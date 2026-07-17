import type { EditableSchema } from '../schemas/editable'
import type {
  HorizontalStitchDirectionSchema,
  StitchLineSchema,
  VerticalStitchDirectionSchema,
} from '../schemas/stitching'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateHexColor } from './validateHexColor'
import { validateName } from './validateName'
import { validateNumber } from './validateNumber'
import { validatePrimitiveUnion } from './validatePrimitiveUnion'

const horizontalStitchDirectionValues: Record<HorizontalStitchDirectionSchema, boolean> = {
  'left-to-right': true,
  'right-to-left': true,
}

const verticalStitchDirectionValues: Record<VerticalStitchDirectionSchema, boolean> = {
  'bottom-to-top': true,
  'top-to-bottom': true,
}

export const validateStitchLineSchema = (
  input: EditableSchema<StitchLineSchema>,
  currentValue: StitchLineSchema,
  context: ValidationContextSchema,
): ValidationResultSchema<StitchLineSchema> => {
  const nameResult = validateName(input.name, currentValue.name, input.id, context.project.stitchLines)
  const colorResult = validateHexColor(input.color, currentValue.color)
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
  const stitchHoleColorResult = validateHexColor(input.stitchHoleColor, currentValue.stitchHoleColor)
  const stitchThreadColorResult = validateHexColor(input.stitchThreadColor, currentValue.stitchThreadColor)
  const topStitchDirectionResult = validatePrimitiveUnion(
    input.topStitchDirection,
    currentValue.topStitchDirection,
    horizontalStitchDirectionValues,
  )
  const rightStitchDirectionResult = validatePrimitiveUnion(
    input.rightStitchDirection,
    currentValue.rightStitchDirection,
    verticalStitchDirectionValues,
  )
  const bottomStitchDirectionResult = validatePrimitiveUnion(
    input.bottomStitchDirection,
    currentValue.bottomStitchDirection,
    horizontalStitchDirectionValues,
  )
  const leftStitchDirectionResult = validatePrimitiveUnion(
    input.leftStitchDirection,
    currentValue.leftStitchDirection,
    verticalStitchDirectionValues,
  )
  const topStartOffsetResult = validateNumber(input.topStartOffset, currentValue.topStartOffset, context, { min: 0 })
  const topEndOffsetResult = validateNumber(input.topEndOffset, currentValue.topEndOffset, context, { min: 0 })
  const rightStartOffsetResult = validateNumber(input.rightStartOffset, currentValue.rightStartOffset, context, {
    min: 0,
  })
  const rightEndOffsetResult = validateNumber(input.rightEndOffset, currentValue.rightEndOffset, context, { min: 0 })
  const bottomStartOffsetResult = validateNumber(input.bottomStartOffset, currentValue.bottomStartOffset, context, {
    min: 0,
  })
  const bottomEndOffsetResult = validateNumber(input.bottomEndOffset, currentValue.bottomEndOffset, context, {
    min: 0,
  })
  const leftStartOffsetResult = validateNumber(input.leftStartOffset, currentValue.leftStartOffset, context, { min: 0 })
  const leftEndOffsetResult = validateNumber(input.leftEndOffset, currentValue.leftEndOffset, context, { min: 0 })

  const issues: ValidationIssuesSchema<StitchLineSchema> = {
    bottom: undefined,
    bottomEndOffset: bottomEndOffsetResult.issues,
    bottomLeftCorner: undefined,
    bottomRightCorner: undefined,
    bottomStartOffset: bottomStartOffsetResult.issues,
    bottomStitchDirection: bottomStitchDirectionResult.issues,
    color: colorResult.issues,
    componentId: undefined,
    id: undefined,
    left: undefined,
    leftEndOffset: leftEndOffsetResult.issues,
    leftStartOffset: leftStartOffsetResult.issues,
    leftStitchDirection: leftStitchDirectionResult.issues,
    name: nameResult.issues,
    right: undefined,
    rightEndOffset: rightEndOffsetResult.issues,
    rightStartOffset: rightStartOffsetResult.issues,
    rightStitchDirection: rightStitchDirectionResult.issues,
    stitchHoleColor: stitchHoleColorResult.issues,
    stitchHoleDistance: stitchHoleDistanceResult.issues,
    stitchHoleLength: stitchHoleLengthResult.issues,
    stitchHoleThickness: stitchHoleThicknessResult.issues,
    stitchMargin: stitchMarginResult.issues,
    stitchThreadColor: stitchThreadColorResult.issues,
    top: undefined,
    topEndOffset: topEndOffsetResult.issues,
    topLeftCorner: undefined,
    topRightCorner: undefined,
    topStartOffset: topStartOffsetResult.issues,
    topStitchDirection: topStitchDirectionResult.issues,
  }

  const committedValue: StitchLineSchema = {
    bottom: input.bottom,
    bottomEndOffset: bottomEndOffsetResult.committedValue,
    bottomLeftCorner: input.bottomLeftCorner,
    bottomRightCorner: input.bottomRightCorner,
    bottomStartOffset: bottomStartOffsetResult.committedValue,
    bottomStitchDirection: bottomStitchDirectionResult.committedValue,
    color: colorResult.committedValue,
    componentId: currentValue.componentId,
    id: currentValue.id,
    left: input.left,
    leftEndOffset: leftEndOffsetResult.committedValue,
    leftStartOffset: leftStartOffsetResult.committedValue,
    leftStitchDirection: leftStitchDirectionResult.committedValue,
    name: nameResult.committedValue,
    right: input.right,
    rightEndOffset: rightEndOffsetResult.committedValue,
    rightStartOffset: rightStartOffsetResult.committedValue,
    rightStitchDirection: rightStitchDirectionResult.committedValue,
    stitchHoleColor: stitchHoleColorResult.committedValue,
    stitchHoleDistance: stitchHoleDistanceResult.committedValue,
    stitchHoleLength: stitchHoleLengthResult.committedValue,
    stitchHoleThickness: stitchHoleThicknessResult.committedValue,
    stitchMargin: stitchMarginResult.committedValue,
    stitchThreadColor: stitchThreadColorResult.committedValue,
    top: input.top,
    topEndOffset: topEndOffsetResult.committedValue,
    topLeftCorner: input.topLeftCorner,
    topRightCorner: input.topRightCorner,
    topStartOffset: topStartOffsetResult.committedValue,
    topStitchDirection: topStitchDirectionResult.committedValue,
  }

  if (
    !nameResult.isValid ||
    !colorResult.isValid ||
    !stitchMarginResult.isValid ||
    !stitchHoleLengthResult.isValid ||
    !stitchHoleDistanceResult.isValid ||
    !stitchHoleThicknessResult.isValid ||
    !stitchHoleColorResult.isValid ||
    !stitchThreadColorResult.isValid ||
    !topStitchDirectionResult.isValid ||
    !rightStitchDirectionResult.isValid ||
    !bottomStitchDirectionResult.isValid ||
    !leftStitchDirectionResult.isValid ||
    !topStartOffsetResult.isValid ||
    !topEndOffsetResult.isValid ||
    !rightStartOffsetResult.isValid ||
    !rightEndOffsetResult.isValid ||
    !bottomStartOffsetResult.isValid ||
    !bottomEndOffsetResult.isValid ||
    !leftStartOffsetResult.isValid ||
    !leftEndOffsetResult.isValid
  ) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}
