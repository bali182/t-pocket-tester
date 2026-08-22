import type { AnchorSchema, HasLayoutOffsetsSchema } from '../schemas/common'
import type { EditableSchema } from '../schemas/editable'
import type { HasAnchorsSchema } from '../schemas/hole'
import type {
  ComponentBasedValidationContextSchema,
  ValidationIssuesSchema,
  ValidationResultSchema,
} from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateNumber } from './validateNumber'
import { validatePrimitiveUnion } from './validatePrimitiveUnion'

const holeAnchorValues: Record<AnchorSchema, boolean> = {
  start: true,
  middle: true,
  end: true,
}

export const validateHolePositionSchema = (
  input: EditableSchema<HasAnchorsSchema & HasLayoutOffsetsSchema>,
  currentValue: HasAnchorsSchema & HasLayoutOffsetsSchema,
  context: ComponentBasedValidationContextSchema,
): ValidationResultSchema<HasAnchorsSchema & HasLayoutOffsetsSchema> => {
  const xAnchorResult = validatePrimitiveUnion(input.xAnchor, currentValue.xAnchor, holeAnchorValues, context)
  const yAnchorResult = validatePrimitiveUnion(input.yAnchor, currentValue.yAnchor, holeAnchorValues, context)
  const xOffsetResult = validateNumber(input.xOffset, currentValue.xOffset, context)
  const yOffsetResult = validateNumber(input.yOffset, currentValue.yOffset, context)

  const issues: ValidationIssuesSchema<HasAnchorsSchema & HasLayoutOffsetsSchema> = {
    xAnchor: xAnchorResult.issues,
    xOffset: xOffsetResult.issues,
    yAnchor: yAnchorResult.issues,
    yOffset: yOffsetResult.issues,
  }
  const committedValue: HasAnchorsSchema & HasLayoutOffsetsSchema = {
    xAnchor: xAnchorResult.committedValue,
    xOffset: xOffsetResult.committedValue,
    yAnchor: yAnchorResult.committedValue,
    yOffset: yOffsetResult.committedValue,
  }

  if (!xAnchorResult.isValid || !yAnchorResult.isValid || !xOffsetResult.isValid || !yOffsetResult.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, {
    xAnchor: xAnchorResult.value,
    xOffset: xOffsetResult.value,
    yAnchor: yAnchorResult.value,
    yOffset: yOffsetResult.value,
  })
}
