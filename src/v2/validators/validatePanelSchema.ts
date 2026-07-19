import type { LayoutOrderSchema, LayoutOrientationSchema, PanelSchema } from '../schemas/components'
import type { EditableSchema } from '../schemas/editable'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateHexColor } from './validateHexColor'
import { validateName } from './validateName'
import { validateNumber } from './validateNumber'
import { validatePrimitiveUnion } from './validatePrimitiveUnion'

const layoutOrientationValues: Record<LayoutOrientationSchema, boolean> = {
  horizontal: true,
  vertical: true,
}

const layoutOrderValues: Record<LayoutOrderSchema, boolean> = {
  default: true,
  reverse: true,
}

export const validatePanelSchema = (
  input: EditableSchema<PanelSchema>,
  currentValue: PanelSchema,
  context: ValidationContextSchema,
): ValidationResultSchema<PanelSchema> => {
  const nameResult = validateName(input.name, currentValue.name, input.id, Object.values(context.project.components), context)
  const colorResult = validateHexColor(input.color, currentValue.color, context)
  const layoutOrientationResult = validatePrimitiveUnion(
    input.layoutOrientation,
    currentValue.layoutOrientation,
    layoutOrientationValues,
    context,
  )
  const layoutOrderResult = validatePrimitiveUnion(input.layoutOrder, currentValue.layoutOrder, layoutOrderValues, context)
  const layoutGapResult = validateNumber(input.layoutGap, currentValue.layoutGap, context, { min: 0 })
  const borderRadiusResult = validateNumber(input.borderRadius, currentValue.borderRadius, context, { min: 0 })
  const topLeftRadiusResult = validateNumber(input.topLeftRadius, currentValue.topLeftRadius, context, { min: 0 })
  const topRightRadiusResult = validateNumber(input.topRightRadius, currentValue.topRightRadius, context, { min: 0 })
  const bottomLeftRadiusResult = validateNumber(input.bottomLeftRadius, currentValue.bottomLeftRadius, context, {
    min: 0,
  })
  const bottomRightRadiusResult = validateNumber(input.bottomRightRadius, currentValue.bottomRightRadius, context, {
    min: 0,
  })
  const widthResult = validateNumber(input.width, currentValue.width, context, { min: 0, minInclusive: false })
  const heightResult = validateNumber(input.height, currentValue.height, context, { min: 0, minInclusive: false })

  const issues: ValidationIssuesSchema<PanelSchema> = {
    autoHeight: undefined,
    autoWidth: undefined,
    borderRadius: borderRadiusResult.issues,
    bottomLeftRadius: bottomLeftRadiusResult.issues,
    bottomRightRadius: bottomRightRadiusResult.issues,
    children: input.children.map(() => undefined),
    color: colorResult.issues,
    height: heightResult.issues,
    id: undefined,
    individualRadii: undefined,
    layoutGap: layoutGapResult.issues,
    layoutOrder: layoutOrderResult.issues,
    layoutOrientation: layoutOrientationResult.issues,
    name: nameResult.issues,
    topLeftRadius: topLeftRadiusResult.issues,
    topRightRadius: topRightRadiusResult.issues,
    type: undefined,
    width: widthResult.issues,
  }

  const committedValue: PanelSchema = {
    autoHeight: input.autoHeight,
    autoWidth: input.autoWidth,
    borderRadius: borderRadiusResult.committedValue,
    bottomLeftRadius: bottomLeftRadiusResult.committedValue,
    bottomRightRadius: bottomRightRadiusResult.committedValue,
    children: currentValue.children,
    color: colorResult.committedValue,
    height: heightResult.committedValue,
    id: currentValue.id,
    individualRadii: input.individualRadii,
    layoutGap: layoutGapResult.committedValue,
    layoutOrder: layoutOrderResult.committedValue,
    layoutOrientation: layoutOrientationResult.committedValue,
    name: nameResult.committedValue,
    topLeftRadius: topLeftRadiusResult.committedValue,
    topRightRadius: topRightRadiusResult.committedValue,
    type: currentValue.type,
    width: widthResult.committedValue,
  }

  if (
    !nameResult.isValid ||
    !colorResult.isValid ||
    !layoutOrientationResult.isValid ||
    !layoutOrderResult.isValid ||
    !layoutGapResult.isValid ||
    !borderRadiusResult.isValid ||
    !topLeftRadiusResult.isValid ||
    !topRightRadiusResult.isValid ||
    !bottomLeftRadiusResult.isValid ||
    !bottomRightRadiusResult.isValid ||
    !widthResult.isValid ||
    !heightResult.isValid
  ) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(
    issues,
    {
      autoHeight: input.autoHeight,
      autoWidth: input.autoWidth,
      borderRadius: borderRadiusResult.value,
      bottomLeftRadius: bottomLeftRadiusResult.value,
      bottomRightRadius: bottomRightRadiusResult.value,
      children: currentValue.children,
      color: colorResult.value,
      height: heightResult.value,
      id: currentValue.id,
      individualRadii: input.individualRadii,
      layoutGap: layoutGapResult.value,
      layoutOrder: layoutOrderResult.value,
      layoutOrientation: layoutOrientationResult.value,
      name: nameResult.value,
      topLeftRadius: topLeftRadiusResult.value,
      topRightRadius: topRightRadiusResult.value,
      type: currentValue.type,
      width: widthResult.value,
    },
    committedValue,
  )
}
