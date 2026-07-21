import type { EditableSchema } from '../schemas/editable'
import type { PocketClusterStitchLineSchema, StitchDirectionSchema } from '../schemas/stitching'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateName } from './validateName'
import { validateNumber } from './validateNumber'
import { validatePrimitiveUnion } from './validatePrimitiveUnion'
import { validateStitchLineCommonConfigSchema } from './validateStitchLineCommonConfigSchema'

const stitchDirectionValues: Record<StitchDirectionSchema, boolean> = {
  'end-to-start': true,
  'start-to-end': true,
}

export const validatePocketClusterStitchLineSchema = (
  input: EditableSchema<PocketClusterStitchLineSchema>,
  currentValue: PocketClusterStitchLineSchema,
  context: ValidationContextSchema,
): ValidationResultSchema<PocketClusterStitchLineSchema> => {
  const nameResult = validateName(input.name, currentValue.name, input.id, context.project.stitchLines, context)
  const commonConfigResult = validateStitchLineCommonConfigSchema(input, currentValue, context)
  const startOffsetResult = validateNumber(input.startOffset, currentValue.startOffset, context)
  const endOffsetResult = validateNumber(input.endOffset, currentValue.endOffset, context)
  const stitchDirectionResult = validatePrimitiveUnion(
    input.stitchDirection,
    currentValue.stitchDirection,
    stitchDirectionValues,
    context,
  )

  const issues: ValidationIssuesSchema<PocketClusterStitchLineSchema> = {
    componentId: undefined,
    enabled: undefined,
    endOffset: endOffsetResult.issues,
    id: undefined,
    name: nameResult.issues,
    startOffset: startOffsetResult.issues,
    stitchDirection: stitchDirectionResult.issues,
    stitchHoleColor: commonConfigResult.issues.stitchHoleColor,
    stitchHoleDistance: commonConfigResult.issues.stitchHoleDistance,
    stitchHoleLength: commonConfigResult.issues.stitchHoleLength,
    stitchHoleThickness: commonConfigResult.issues.stitchHoleThickness,
    stitchLineColor: commonConfigResult.issues.stitchLineColor,
    stitchLineThickness: commonConfigResult.issues.stitchLineThickness,
    stitchMargin: commonConfigResult.issues.stitchMargin,
    type: undefined,
  }

  const committedValue: PocketClusterStitchLineSchema = {
    ...commonConfigResult.committedValue,
    componentId: input.componentId,
    enabled: input.enabled,
    endOffset: endOffsetResult.committedValue,
    id: currentValue.id,
    name: nameResult.committedValue,
    startOffset: startOffsetResult.committedValue,
    stitchDirection: stitchDirectionResult.committedValue,
    type: currentValue.type,
  }

  if (
    !nameResult.isValid ||
    !commonConfigResult.isValid ||
    !startOffsetResult.isValid ||
    !endOffsetResult.isValid ||
    !stitchDirectionResult.isValid
  ) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}
