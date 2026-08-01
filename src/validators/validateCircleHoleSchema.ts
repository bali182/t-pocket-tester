import type { EditableSchema } from '../schemas/editable'
import type { CircleHoleSchema } from '../schemas/hole'
import type {
  ComponentBasedValidationContextSchema,
  ValidationIssuesSchema,
  ValidationResultSchema,
} from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateHolePositionSchema } from './validateHolePositionSchema'
import { validateName } from './validateName'
import { validateNumber } from './validateNumber'

export const validateCircleHoleSchema = (
  input: EditableSchema<CircleHoleSchema>,
  currentValue: CircleHoleSchema,
  context: ComponentBasedValidationContextSchema,
): ValidationResultSchema<CircleHoleSchema> => {
  const nameResult = validateName(input.name, currentValue.name, input.id, context.project.holes, context)
  const positionResult = validateHolePositionSchema(input, currentValue, context)
  const radiusResult = validateNumber(input.radius, currentValue.radius, context, { min: 1 })
  const issues: ValidationIssuesSchema<CircleHoleSchema> = {
    componentId: undefined,
    id: undefined,
    name: nameResult.issues,
    radius: radiusResult.issues,
    type: undefined,
    xAnchor: positionResult.issues.xAnchor,
    xOffset: positionResult.issues.xOffset,
    yAnchor: positionResult.issues.yAnchor,
    yOffset: positionResult.issues.yOffset,
  }
  const committedValue: CircleHoleSchema = {
    componentId: input.componentId,
    id: currentValue.id,
    name: nameResult.committedValue,
    radius: radiusResult.committedValue,
    type: currentValue.type,
    ...positionResult.committedValue,
  }

  if (!nameResult.isValid || !positionResult.isValid || !radiusResult.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, {
    componentId: input.componentId,
    id: currentValue.id,
    name: nameResult.value,
    radius: radiusResult.value,
    type: currentValue.type,
    ...positionResult.value,
  })
}
