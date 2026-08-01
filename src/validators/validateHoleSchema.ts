import type { EditableSchema } from '../schemas/editable'
import type { HoleSchema } from '../schemas/hole'
import type {
  ComponentBasedValidationContextSchema,
  ValidationIssuesSchema,
  ValidationResultSchema,
} from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateHolePositionSchema } from './validateHolePositionSchema'
import { validateName } from './validateName'
import { validateNumber } from './validateNumber'

export const validateHoleSchema = (
  input: EditableSchema<HoleSchema>,
  currentValue: HoleSchema,
  context: ComponentBasedValidationContextSchema,
): ValidationResultSchema<HoleSchema> => {
  const nameResult = validateName(input.name, currentValue.name, input.id, context.project.holes, context)
  const positionResult = validateHolePositionSchema(input, currentValue, context)
  const widthResult = validateNumber(input.width, currentValue.width, context, { min: 1 })
  const heightResult = validateNumber(input.height, currentValue.height, context, { min: 1 })
  const borderRadiusResult = validateNumber(input.borderRadius, currentValue.borderRadius, context)
  const topLeftRadiusResult = validateNumber(input.topLeftRadius, currentValue.topLeftRadius, context)
  const topRightRadiusResult = validateNumber(input.topRightRadius, currentValue.topRightRadius, context)
  const bottomLeftRadiusResult = validateNumber(input.bottomLeftRadius, currentValue.bottomLeftRadius, context)
  const bottomRightRadiusResult = validateNumber(input.bottomRightRadius, currentValue.bottomRightRadius, context)
  const issues: ValidationIssuesSchema<HoleSchema> = {
    borderRadius: borderRadiusResult.issues,
    bottomLeftRadius: bottomLeftRadiusResult.issues,
    bottomRightRadius: bottomRightRadiusResult.issues,
    componentId: undefined,
    height: heightResult.issues,
    id: undefined,
    individualRadii: undefined,
    name: nameResult.issues,
    topLeftRadius: topLeftRadiusResult.issues,
    topRightRadius: topRightRadiusResult.issues,
    width: widthResult.issues,
    xAnchor: positionResult.issues.xAnchor,
    xOffset: positionResult.issues.xOffset,
    yAnchor: positionResult.issues.yAnchor,
    yOffset: positionResult.issues.yOffset,
  }
  const committedValue: HoleSchema = {
    borderRadius: borderRadiusResult.committedValue,
    bottomLeftRadius: bottomLeftRadiusResult.committedValue,
    bottomRightRadius: bottomRightRadiusResult.committedValue,
    componentId: input.componentId,
    height: heightResult.committedValue,
    id: currentValue.id,
    individualRadii: input.individualRadii,
    name: nameResult.committedValue,
    topLeftRadius: topLeftRadiusResult.committedValue,
    topRightRadius: topRightRadiusResult.committedValue,
    width: widthResult.committedValue,
    ...positionResult.committedValue,
  }

  if (
    !nameResult.isValid ||
    !positionResult.isValid ||
    !widthResult.isValid ||
    !heightResult.isValid ||
    !borderRadiusResult.isValid ||
    !topLeftRadiusResult.isValid ||
    !topRightRadiusResult.isValid ||
    !bottomLeftRadiusResult.isValid ||
    !bottomRightRadiusResult.isValid
  ) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, {
    borderRadius: borderRadiusResult.value,
    bottomLeftRadius: bottomLeftRadiusResult.value,
    bottomRightRadius: bottomRightRadiusResult.value,
    componentId: input.componentId,
    height: heightResult.value,
    id: currentValue.id,
    individualRadii: input.individualRadii,
    name: nameResult.value,
    topLeftRadius: topLeftRadiusResult.value,
    topRightRadius: topRightRadiusResult.value,
    width: widthResult.value,
    ...positionResult.value,
  })
}
