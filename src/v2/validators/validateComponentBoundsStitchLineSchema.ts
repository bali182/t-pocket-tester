import type { EditableSchema } from '../schemas/editable'
import type {
  HorizontalStitchDirectionSchema,
  ComponentBoundsStitchLineSchema,
  VerticalStitchDirectionSchema,
} from '../schemas/stitching'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateName } from './validateName'
import { validateNumber } from './validateNumber'
import { validatePrimitiveUnion } from './validatePrimitiveUnion'
import { validateStitchLineCommonConfigSchema } from './validateStitchLineCommonConfigSchema'

const horizontalStitchDirectionValues: Record<HorizontalStitchDirectionSchema, boolean> = {
  'left-to-right': true,
  'right-to-left': true,
}

const verticalStitchDirectionValues: Record<VerticalStitchDirectionSchema, boolean> = {
  'bottom-to-top': true,
  'top-to-bottom': true,
}

export const validateComponentBoundsStitchLineSchema = (
  input: EditableSchema<ComponentBoundsStitchLineSchema>,
  currentValue: ComponentBoundsStitchLineSchema,
  context: ValidationContextSchema,
): ValidationResultSchema<ComponentBoundsStitchLineSchema> => {
  const nameResult = validateName(input.name, currentValue.name, input.id, context.project.stitchLines, context)
  const commonConfigResult = validateStitchLineCommonConfigSchema(input, currentValue, context)
  const topStitchDirectionResult = validatePrimitiveUnion(
    input.topStitchDirection,
    currentValue.topStitchDirection,
    horizontalStitchDirectionValues,
    context,
  )
  const rightStitchDirectionResult = validatePrimitiveUnion(
    input.rightStitchDirection,
    currentValue.rightStitchDirection,
    verticalStitchDirectionValues,
    context,
  )
  const bottomStitchDirectionResult = validatePrimitiveUnion(
    input.bottomStitchDirection,
    currentValue.bottomStitchDirection,
    horizontalStitchDirectionValues,
    context,
  )
  const leftStitchDirectionResult = validatePrimitiveUnion(
    input.leftStitchDirection,
    currentValue.leftStitchDirection,
    verticalStitchDirectionValues,
    context,
  )
  const topStartOffsetResult = validateNumber(input.topStartOffset, currentValue.topStartOffset, context)
  const topEndOffsetResult = validateNumber(input.topEndOffset, currentValue.topEndOffset, context)
  const rightStartOffsetResult = validateNumber(input.rightStartOffset, currentValue.rightStartOffset, context)
  const rightEndOffsetResult = validateNumber(input.rightEndOffset, currentValue.rightEndOffset, context)
  const bottomStartOffsetResult = validateNumber(input.bottomStartOffset, currentValue.bottomStartOffset, context)
  const bottomEndOffsetResult = validateNumber(input.bottomEndOffset, currentValue.bottomEndOffset, context)
  const leftStartOffsetResult = validateNumber(input.leftStartOffset, currentValue.leftStartOffset, context)
  const leftEndOffsetResult = validateNumber(input.leftEndOffset, currentValue.leftEndOffset, context)

  const issues: ValidationIssuesSchema<ComponentBoundsStitchLineSchema> = {
    bottom: undefined,
    bottomEndOffset: bottomEndOffsetResult.issues,
    bottomLeftCorner: undefined,
    bottomRightCorner: undefined,
    bottomStartOffset: bottomStartOffsetResult.issues,
    bottomStitchDirection: bottomStitchDirectionResult.issues,
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
    stitchHoleColor: commonConfigResult.issues.stitchHoleColor,
    stitchHoleDistance: commonConfigResult.issues.stitchHoleDistance,
    stitchHoleLength: commonConfigResult.issues.stitchHoleLength,
    stitchHoleThickness: commonConfigResult.issues.stitchHoleThickness,
    stitchLineThickness: commonConfigResult.issues.stitchLineThickness,
    stitchMargin: commonConfigResult.issues.stitchMargin,
    stitchLineColor: commonConfigResult.issues.stitchLineColor,
    type: undefined,
    top: undefined,
    topEndOffset: topEndOffsetResult.issues,
    topLeftCorner: undefined,
    topRightCorner: undefined,
    topStartOffset: topStartOffsetResult.issues,
    topStitchDirection: topStitchDirectionResult.issues,
  }

  const committedValue: ComponentBoundsStitchLineSchema = {
    ...commonConfigResult.committedValue,
    bottom: input.bottom,
    bottomEndOffset: bottomEndOffsetResult.committedValue,
    bottomLeftCorner: input.bottomLeftCorner,
    bottomRightCorner: input.bottomRightCorner,
    bottomStartOffset: bottomStartOffsetResult.committedValue,
    bottomStitchDirection: bottomStitchDirectionResult.committedValue,
    componentId: input.componentId,
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
    top: input.top,
    topEndOffset: topEndOffsetResult.committedValue,
    topLeftCorner: input.topLeftCorner,
    topRightCorner: input.topRightCorner,
    topStartOffset: topStartOffsetResult.committedValue,
    topStitchDirection: topStitchDirectionResult.committedValue,
    type: currentValue.type,
  }

  if (
    !nameResult.isValid ||
    !commonConfigResult.isValid ||
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
