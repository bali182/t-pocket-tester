import type { EditableSchema } from '../schemas/editable'
import type {
  MagicFixComponentBoundsStitchLineConfigSchema,
  MagicFixHasCornerRadiusConfigSchema,
  MagicFixHasDimensionsConfigSchema,
  MagicFixHasGapConfigSchema,
  MagicFixHasPreferredMinimumDistanceFromEdgeConfigSchema,
  MagicFixNumericRangeSchema,
  MagicFixPanelConfigSchema,
  MagicFixPocketClusterConfigSchema,
  MagicFixPocketClusterStitchLineConfigSchema,
  MagicFixRootPanelConfigSchema,
} from '../schemas/magicFixConfig'
import type { BaseValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateNumber } from './validateNumber'

export const validateMagicFixNumericRange = (
  input: EditableSchema<MagicFixNumericRangeSchema>,
  currentValue: MagicFixNumericRangeSchema,
  context: BaseValidationContextSchema,
): ValidationResultSchema<MagicFixNumericRangeSchema> => {
  const maxDecrease = validateNumber(input.maxDecrease, currentValue.maxDecrease, context, { min: 0 })
  const maxIncrease = validateNumber(input.maxIncrease, currentValue.maxIncrease, context, { min: 0 })
  const issues = { maxDecrease: maxDecrease.issues, maxIncrease: maxIncrease.issues }
  const committedValue = { maxDecrease: maxDecrease.committedValue, maxIncrease: maxIncrease.committedValue }

  if (!maxDecrease.isValid || !maxIncrease.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}

export const validateMagicFixPreferredMinimumDistance = (
  input: EditableSchema<MagicFixHasPreferredMinimumDistanceFromEdgeConfigSchema>,
  currentValue: MagicFixHasPreferredMinimumDistanceFromEdgeConfigSchema,
  context: BaseValidationContextSchema,
): ValidationResultSchema<MagicFixHasPreferredMinimumDistanceFromEdgeConfigSchema> => {
  const preferredMinimumDistanceFromEdge = validateNumber(
    input.preferredMinimumDistanceFromEdge,
    currentValue.preferredMinimumDistanceFromEdge,
    context,
    { min: 0 },
  )

  const issues = { preferredMinimumDistanceFromEdge: preferredMinimumDistanceFromEdge.issues }
  const committedValue = { preferredMinimumDistanceFromEdge: preferredMinimumDistanceFromEdge.committedValue }

  if (!preferredMinimumDistanceFromEdge.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}

export const validateMagicFixDimensions = (
  input: EditableSchema<MagicFixHasDimensionsConfigSchema>,
  currentValue: MagicFixHasDimensionsConfigSchema,
  context: BaseValidationContextSchema,
): ValidationResultSchema<MagicFixHasDimensionsConfigSchema> => {
  const fixedHeightRange = validateMagicFixNumericRange(input.fixedHeightRange, currentValue.fixedHeightRange, context)
  const fixedWidthRange = validateMagicFixNumericRange(input.fixedWidthRange, currentValue.fixedWidthRange, context)

  const issues = { fixedHeightRange: fixedHeightRange.issues, fixedWidthRange: fixedWidthRange.issues }
  const committedValue = {
    fixedHeightRange: fixedHeightRange.committedValue,
    fixedWidthRange: fixedWidthRange.committedValue,
  }

  if (!fixedHeightRange.isValid || !fixedWidthRange.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}

export const validateMagicFixGap = (
  input: EditableSchema<MagicFixHasGapConfigSchema>,
  currentValue: MagicFixHasGapConfigSchema,
  context: BaseValidationContextSchema,
): ValidationResultSchema<MagicFixHasGapConfigSchema> => {
  const layoutGapRange = validateMagicFixNumericRange(input.layoutGapRange, currentValue.layoutGapRange, context)

  const issues = { layoutGapRange: layoutGapRange.issues }
  const committedValue = { layoutGapRange: layoutGapRange.committedValue }

  if (!layoutGapRange.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}

export const validateMagicFixCornerRadius = (
  input: EditableSchema<MagicFixHasCornerRadiusConfigSchema>,
  currentValue: MagicFixHasCornerRadiusConfigSchema,
  context: BaseValidationContextSchema,
): ValidationResultSchema<MagicFixHasCornerRadiusConfigSchema> => {
  const borderRadiusRange = validateMagicFixNumericRange(
    input.borderRadiusRange,
    currentValue.borderRadiusRange,
    context,
  )
  const bottomRightRadiusRange = validateMagicFixNumericRange(
    input.bottomRightRadiusRange,
    currentValue.bottomRightRadiusRange,
    context,
  )
  const bottomLeftRadiusRange = validateMagicFixNumericRange(
    input.bottomLeftRadiusRange,
    currentValue.bottomLeftRadiusRange,
    context,
  )
  const topLeftRadiusRange = validateMagicFixNumericRange(
    input.topLeftRadiusRange,
    currentValue.topLeftRadiusRange,
    context,
  )
  const topRightRadiusRange = validateMagicFixNumericRange(
    input.topRightRadiusRange,
    currentValue.topRightRadiusRange,
    context,
  )

  const issues = {
    borderRadiusRange: borderRadiusRange.issues,
    bottomLeftRadiusRange: bottomLeftRadiusRange.issues,
    bottomRightRadiusRange: bottomRightRadiusRange.issues,
    canConvertToIndividualRadii: undefined,
    topLeftRadiusRange: topLeftRadiusRange.issues,
    topRightRadiusRange: topRightRadiusRange.issues,
  }
  const committedValue = {
    borderRadiusRange: borderRadiusRange.committedValue,
    bottomLeftRadiusRange: bottomLeftRadiusRange.committedValue,
    bottomRightRadiusRange: bottomRightRadiusRange.committedValue,
    canConvertToIndividualRadii: input.canConvertToIndividualRadii,
    topLeftRadiusRange: topLeftRadiusRange.committedValue,
    topRightRadiusRange: topRightRadiusRange.committedValue,
  }

  if (
    !borderRadiusRange.isValid ||
    !bottomRightRadiusRange.isValid ||
    !bottomLeftRadiusRange.isValid ||
    !topLeftRadiusRange.isValid ||
    !topRightRadiusRange.isValid
  ) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}

export const validateMagicFixComponentBoundsStitchLineConfig = (
  input: EditableSchema<MagicFixComponentBoundsStitchLineConfigSchema>,
  currentValue: MagicFixComponentBoundsStitchLineConfigSchema,
  context: BaseValidationContextSchema,
): ValidationResultSchema<MagicFixComponentBoundsStitchLineConfigSchema> => {
  const topStartOffsetRange = validateMagicFixNumericRange(
    input.topStartOffsetRange,
    currentValue.topStartOffsetRange,
    context,
  )
  const topEndOffsetRange = validateMagicFixNumericRange(
    input.topEndOffsetRange,
    currentValue.topEndOffsetRange,
    context,
  )
  const rightStartOffsetRange = validateMagicFixNumericRange(
    input.rightStartOffsetRange,
    currentValue.rightStartOffsetRange,
    context,
  )
  const rightEndOffsetRange = validateMagicFixNumericRange(
    input.rightEndOffsetRange,
    currentValue.rightEndOffsetRange,
    context,
  )
  const bottomStartOffsetRange = validateMagicFixNumericRange(
    input.bottomStartOffsetRange,
    currentValue.bottomStartOffsetRange,
    context,
  )
  const bottomEndOffsetRange = validateMagicFixNumericRange(
    input.bottomEndOffsetRange,
    currentValue.bottomEndOffsetRange,
    context,
  )
  const leftStartOffsetRange = validateMagicFixNumericRange(
    input.leftStartOffsetRange,
    currentValue.leftStartOffsetRange,
    context,
  )
  const leftEndOffsetRange = validateMagicFixNumericRange(
    input.leftEndOffsetRange,
    currentValue.leftEndOffsetRange,
    context,
  )
  const issues: ValidationIssuesSchema<MagicFixComponentBoundsStitchLineConfigSchema> = {
    bottomEndOffsetRange: bottomEndOffsetRange.issues,
    bottomStartOffsetRange: bottomStartOffsetRange.issues,
    canFlipBottomStitchDirection: undefined,
    canFlipLeftStitchDirection: undefined,
    canFlipRightStitchDirection: undefined,
    canFlipTopStitchDirection: undefined,
    leftEndOffsetRange: leftEndOffsetRange.issues,
    leftStartOffsetRange: leftStartOffsetRange.issues,
    rightEndOffsetRange: rightEndOffsetRange.issues,
    rightStartOffsetRange: rightStartOffsetRange.issues,
    topEndOffsetRange: topEndOffsetRange.issues,
    topStartOffsetRange: topStartOffsetRange.issues,
    stitchLineId: undefined,
    type: undefined,
  }
  const committedValue: MagicFixComponentBoundsStitchLineConfigSchema = {
    bottomEndOffsetRange: bottomEndOffsetRange.committedValue,
    bottomStartOffsetRange: bottomStartOffsetRange.committedValue,
    canFlipBottomStitchDirection: input.canFlipBottomStitchDirection,
    canFlipLeftStitchDirection: input.canFlipLeftStitchDirection,
    canFlipRightStitchDirection: input.canFlipRightStitchDirection,
    canFlipTopStitchDirection: input.canFlipTopStitchDirection,
    leftEndOffsetRange: leftEndOffsetRange.committedValue,
    leftStartOffsetRange: leftStartOffsetRange.committedValue,
    rightEndOffsetRange: rightEndOffsetRange.committedValue,
    rightStartOffsetRange: rightStartOffsetRange.committedValue,
    topEndOffsetRange: topEndOffsetRange.committedValue,
    topStartOffsetRange: topStartOffsetRange.committedValue,
    stitchLineId: input.stitchLineId,
    type: input.type,
  }
  const isValid =
    topStartOffsetRange.isValid &&
    topEndOffsetRange.isValid &&
    rightStartOffsetRange.isValid &&
    rightEndOffsetRange.isValid &&
    bottomStartOffsetRange.isValid &&
    bottomEndOffsetRange.isValid &&
    leftStartOffsetRange.isValid &&
    leftEndOffsetRange.isValid

  if (!isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}

export const validateMagicFixRootPanelConfig = (
  input: EditableSchema<MagicFixRootPanelConfigSchema>,
  currentValue: MagicFixRootPanelConfigSchema,
  context: BaseValidationContextSchema,
): ValidationResultSchema<MagicFixRootPanelConfigSchema> => {
  const distance = validateMagicFixPreferredMinimumDistance(input, currentValue, context)
  const gap = validateMagicFixGap(input, currentValue, context)
  const dimensions = validateMagicFixDimensions(input, currentValue, context)
  const cornerRadius = validateMagicFixCornerRadius(input, currentValue, context)
  const issues: ValidationIssuesSchema<MagicFixRootPanelConfigSchema> = {
    ...distance.issues,
    ...gap.issues,
    ...dimensions.issues,
    ...cornerRadius.issues,
    componentId: undefined,
    type: undefined,
  }
  const committedValue: MagicFixRootPanelConfigSchema = {
    ...distance.committedValue,
    ...gap.committedValue,
    ...dimensions.committedValue,
    ...cornerRadius.committedValue,
    componentId: input.componentId,
    type: input.type,
  }

  if (!distance.isValid || !gap.isValid || !dimensions.isValid || !cornerRadius.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}

export const validateMagicFixPanelConfig = (
  input: EditableSchema<MagicFixPanelConfigSchema>,
  currentValue: MagicFixPanelConfigSchema,
  context: BaseValidationContextSchema,
): ValidationResultSchema<MagicFixPanelConfigSchema> => {
  const distance = validateMagicFixPreferredMinimumDistance(input, currentValue, context)
  const gap = validateMagicFixGap(input, currentValue, context)
  const dimensions = validateMagicFixDimensions(input, currentValue, context)
  const cornerRadius = validateMagicFixCornerRadius(input, currentValue, context)
  const issues: ValidationIssuesSchema<MagicFixPanelConfigSchema> = {
    ...distance.issues,
    ...gap.issues,
    ...dimensions.issues,
    ...cornerRadius.issues,
    canConvertToFixedHeight: undefined,
    canConvertToFixedWidth: undefined,
    componentId: undefined,
    type: undefined,
  }
  const committedValue: MagicFixPanelConfigSchema = {
    ...distance.committedValue,
    ...gap.committedValue,
    ...dimensions.committedValue,
    ...cornerRadius.committedValue,
    canConvertToFixedHeight: input.canConvertToFixedHeight,
    canConvertToFixedWidth: input.canConvertToFixedWidth,
    componentId: input.componentId,
    type: input.type,
  }

  if (!distance.isValid || !gap.isValid || !dimensions.isValid || !cornerRadius.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}

export const validateMagicFixPocketClusterConfig = (
  input: EditableSchema<MagicFixPocketClusterConfigSchema>,
  currentValue: MagicFixPocketClusterConfigSchema,
  context: BaseValidationContextSchema,
): ValidationResultSchema<MagicFixPocketClusterConfigSchema> => {
  const distance = validateMagicFixPreferredMinimumDistance(input, currentValue, context)
  const dimensions = validateMagicFixDimensions(input, currentValue, context)
  const cornerRadius = validateMagicFixCornerRadius(input, currentValue, context)
  const pocketStepRange = validateMagicFixNumericRange(input.pocketStepRange, currentValue.pocketStepRange, context)
  const issues: ValidationIssuesSchema<MagicFixPocketClusterConfigSchema> = {
    ...distance.issues,
    ...dimensions.issues,
    ...cornerRadius.issues,
    canConvertToFixedHeight: undefined,
    canConvertToFixedWidth: undefined,
    componentId: undefined,
    pocketStepRange: pocketStepRange.issues,
    type: undefined,
  }
  const committedValue: MagicFixPocketClusterConfigSchema = {
    ...distance.committedValue,
    ...dimensions.committedValue,
    ...cornerRadius.committedValue,
    canConvertToFixedHeight: input.canConvertToFixedHeight,
    canConvertToFixedWidth: input.canConvertToFixedWidth,
    componentId: input.componentId,
    pocketStepRange: pocketStepRange.committedValue,
    type: input.type,
  }

  if (!distance.isValid || !dimensions.isValid || !cornerRadius.isValid || !pocketStepRange.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}

export const validateMagicFixPocketClusterStitchLineConfig = (
  input: EditableSchema<MagicFixPocketClusterStitchLineConfigSchema>,
  currentValue: MagicFixPocketClusterStitchLineConfigSchema,
  context: BaseValidationContextSchema,
): ValidationResultSchema<MagicFixPocketClusterStitchLineConfigSchema> => {
  const startOffsetRange = validateMagicFixNumericRange(input.startOffsetRange, currentValue.startOffsetRange, context)
  const endOffsetRange = validateMagicFixNumericRange(input.endOffsetRange, currentValue.endOffsetRange, context)
  const issues: ValidationIssuesSchema<MagicFixPocketClusterStitchLineConfigSchema> = {
    canFlipStitchDirection: undefined,
    endOffsetRange: endOffsetRange.issues,
    startOffsetRange: startOffsetRange.issues,
    stitchLineId: undefined,
    type: undefined,
  }
  const committedValue: MagicFixPocketClusterStitchLineConfigSchema = {
    canFlipStitchDirection: input.canFlipStitchDirection,
    endOffsetRange: endOffsetRange.committedValue,
    startOffsetRange: startOffsetRange.committedValue,
    stitchLineId: input.stitchLineId,
    type: input.type,
  }

  if (!startOffsetRange.isValid || !endOffsetRange.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}
