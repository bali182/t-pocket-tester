import type { ComponentSchema } from '../../../../schemas/components'
import type {
  MagicFixComponentConfigSchema,
  MagicFixHasCornerRadiusConfigSchema,
  MagicFixNumericRangeSchema,
  MagicFixStitchLineConfigSchema,
} from '../../../../schemas/magicFixConfig'
import type { MagicFixBaseInput } from '../../../../schemas/magicFixHeuristics'
import type {
  HorizontalStitchDirectionSchema,
  StitchLineSchema,
  VerticalStitchDirectionSchema,
} from '../../../../schemas/stitching'
import { isDefined } from '../../../../utils/isDefined'
import type { AdaptiveMagicFixField, AdaptiveMagicFixFieldPath } from './types'

export const getAdjustableFields = (input: MagicFixBaseInput): AdaptiveMagicFixField[] => {
  const fields: AdaptiveMagicFixField[] = []

  for (const component of Object.values(input.subProject.components)) {
    const config = getComponentConfig(input, component.id)
    addComponentFields(fields, component, config)
  }

  for (const stitchLine of input.subProject.stitchLines) {
    const config = getStitchLineConfig(input, stitchLine.id)
    addStitchLineFields(fields, stitchLine, config)
  }

  return fields
}

const addComponentFields = (
  fields: AdaptiveMagicFixField[],
  component: ComponentSchema,
  config: MagicFixComponentConfigSchema,
): void => {
  switch (component.type) {
    case 'root-panel': {
      if (config.type !== 'magic-fix-root-panel-config') {
        throw new Error(`Invalid Magic Fix config for root panel: "${component.id}"!`)
      }
      addNumericField(fields, ['components', component.id, 'width'], component.width, config.fixedWidthRange)
      addNumericField(fields, ['components', component.id, 'height'], component.height, config.fixedHeightRange)
      addNumericField(fields, ['components', component.id, 'layoutGap'], component.layoutGap, config.layoutGapRange)
      addCornerRadiusFields(fields, component, config)
      break
    }
    case 'panel': {
      if (config.type !== 'magic-fix-panel-config') {
        throw new Error(`Invalid Magic Fix config for panel: "${component.id}"!`)
      }
      addFillableDimensionFields(
        fields,
        component.id,
        'width',
        component.width,
        component.autoWidth,
        config.canConvertToFixedWidth,
        config.fixedWidthRange,
      )
      addFillableDimensionFields(
        fields,
        component.id,
        'height',
        component.height,
        component.autoHeight,
        config.canConvertToFixedHeight,
        config.fixedHeightRange,
      )
      addNumericField(fields, ['components', component.id, 'layoutGap'], component.layoutGap, config.layoutGapRange)
      addCornerRadiusFields(fields, component, config)
      break
    }
    case 'pocket-cluster': {
      if (config.type !== 'magic-fix-pocket-cluster-config') {
        throw new Error(`Invalid Magic Fix config for pocket cluster: "${component.id}"!`)
      }
      addFillableDimensionFields(
        fields,
        component.id,
        'width',
        component.width,
        component.autoWidth,
        config.canConvertToFixedWidth,
        config.fixedWidthRange,
      )
      addFillableDimensionFields(
        fields,
        component.id,
        'height',
        component.height,
        component.autoHeight,
        config.canConvertToFixedHeight,
        config.fixedHeightRange,
      )
      addNumericField(fields, ['components', component.id, 'pocketStep'], component.pocketStep, config.pocketStepRange)
      addCornerRadiusFields(fields, component, config)
      break
    }
  }
}

const addFillableDimensionFields = (
  fields: AdaptiveMagicFixField[],
  componentId: string,
  dimensionField: 'width' | 'height',
  value: number,
  isAuto: boolean,
  canConvertToFixed: boolean,
  range: MagicFixNumericRangeSchema,
): void => {
  if (isAuto) {
    if (!canConvertToFixed) {
      return
    }

    fields.push({
      type: 'boolean',
      path: ['components', componentId, dimensionField === 'width' ? 'autoWidth' : 'autoHeight'],
      initialValue: true,
    })
  }

  addNumericField(fields, ['components', componentId, dimensionField], value, range)
}

const addCornerRadiusFields = (
  fields: AdaptiveMagicFixField[],
  component: ComponentSchema,
  config: MagicFixHasCornerRadiusConfigSchema,
): void => {
  if (component.individualRadii) {
    addIndividualCornerRadiusFields(fields, component, config)
    return
  }

  addNumericField(
    fields,
    ['components', component.id, 'borderRadius'],
    component.borderRadius,
    config.borderRadiusRange,
  )
  if (!config.canConvertToIndividualRadii) {
    return
  }

  fields.push({
    type: 'boolean',
    path: ['components', component.id, 'individualRadii'],
    initialValue: false,
  })
  addIndividualCornerRadiusFields(fields, component, config)
}

const addIndividualCornerRadiusFields = (
  fields: AdaptiveMagicFixField[],
  component: ComponentSchema,
  config: MagicFixHasCornerRadiusConfigSchema,
): void => {
  addNumericField(
    fields,
    ['components', component.id, 'topLeftRadius'],
    component.topLeftRadius,
    config.topLeftRadiusRange,
  )
  addNumericField(
    fields,
    ['components', component.id, 'topRightRadius'],
    component.topRightRadius,
    config.topRightRadiusRange,
  )
  addNumericField(
    fields,
    ['components', component.id, 'bottomRightRadius'],
    component.bottomRightRadius,
    config.bottomRightRadiusRange,
  )
  addNumericField(
    fields,
    ['components', component.id, 'bottomLeftRadius'],
    component.bottomLeftRadius,
    config.bottomLeftRadiusRange,
  )
}

const addStitchLineFields = (
  fields: AdaptiveMagicFixField[],
  stitchLine: StitchLineSchema,
  config: MagicFixStitchLineConfigSchema,
): void => {
  switch (stitchLine.type) {
    case 'component-bounds-stitch-line': {
      if (config.type !== 'magic-fix-component-bounds-stitch-line-config') {
        throw new Error(`Invalid Magic Fix config for component bounds stitch line: "${stitchLine.id}"!`)
      }
      addNumericField(
        fields,
        ['stitchLines', stitchLine.id, 'topStartOffset'],
        stitchLine.topStartOffset,
        config.topStartOffsetRange,
      )
      addNumericField(
        fields,
        ['stitchLines', stitchLine.id, 'topEndOffset'],
        stitchLine.topEndOffset,
        config.topEndOffsetRange,
      )
      addNumericField(
        fields,
        ['stitchLines', stitchLine.id, 'rightStartOffset'],
        stitchLine.rightStartOffset,
        config.rightStartOffsetRange,
      )
      addNumericField(
        fields,
        ['stitchLines', stitchLine.id, 'rightEndOffset'],
        stitchLine.rightEndOffset,
        config.rightEndOffsetRange,
      )
      addNumericField(
        fields,
        ['stitchLines', stitchLine.id, 'bottomStartOffset'],
        stitchLine.bottomStartOffset,
        config.bottomStartOffsetRange,
      )
      addNumericField(
        fields,
        ['stitchLines', stitchLine.id, 'bottomEndOffset'],
        stitchLine.bottomEndOffset,
        config.bottomEndOffsetRange,
      )
      addNumericField(
        fields,
        ['stitchLines', stitchLine.id, 'leftStartOffset'],
        stitchLine.leftStartOffset,
        config.leftStartOffsetRange,
      )
      addNumericField(
        fields,
        ['stitchLines', stitchLine.id, 'leftEndOffset'],
        stitchLine.leftEndOffset,
        config.leftEndOffsetRange,
      )
      if (config.canFlipTopStitchDirection) {
        addHorizontalDirectionField(fields, stitchLine.id, 'topStitchDirection', stitchLine.topStitchDirection)
      }
      if (config.canFlipBottomStitchDirection) {
        addHorizontalDirectionField(fields, stitchLine.id, 'bottomStitchDirection', stitchLine.bottomStitchDirection)
      }
      if (config.canFlipRightStitchDirection) {
        addVerticalDirectionField(fields, stitchLine.id, 'rightStitchDirection', stitchLine.rightStitchDirection)
      }
      if (config.canFlipLeftStitchDirection) {
        addVerticalDirectionField(fields, stitchLine.id, 'leftStitchDirection', stitchLine.leftStitchDirection)
      }
      break
    }
    case 'pocket-cluster-stitch-line': {
      if (config.type !== 'magic-fix-pocket-cluster-stitch-line-config') {
        throw new Error(`Invalid Magic Fix config for pocket cluster stitch line: "${stitchLine.id}"!`)
      }
      addNumericField(
        fields,
        ['stitchLines', stitchLine.id, 'startOffset'],
        stitchLine.startOffset,
        config.startOffsetRange,
      )
      addNumericField(fields, ['stitchLines', stitchLine.id, 'endOffset'], stitchLine.endOffset, config.endOffsetRange)
      if (config.canFlipStitchDirection) {
        fields.push({
          type: 'pocket-cluster-direction',
          path: ['stitchLines', stitchLine.id, 'stitchDirection'],
          initialValue: stitchLine.stitchDirection,
          alternativeValue: stitchLine.stitchDirection === 'start-to-end' ? 'end-to-start' : 'start-to-end',
        })
      }
      break
    }
  }
}

const addNumericField = (
  fields: AdaptiveMagicFixField[],
  path: AdaptiveMagicFixFieldPath,
  currentValue: number,
  range: MagicFixNumericRangeSchema,
): void => {
  const minValue = currentValue - range.maxDecrease
  const maxValue = currentValue + range.maxIncrease
  if (minValue === maxValue) {
    return
  }
  fields.push({ type: 'numeric', path, minValue, maxValue })
}

const addHorizontalDirectionField = (
  fields: AdaptiveMagicFixField[],
  stitchLineId: string,
  field: 'topStitchDirection' | 'bottomStitchDirection',
  initialValue: HorizontalStitchDirectionSchema,
): void => {
  fields.push({
    type: 'horizontal-direction',
    path: ['stitchLines', stitchLineId, field],
    initialValue,
    alternativeValue: initialValue === 'left-to-right' ? 'right-to-left' : 'left-to-right',
  })
}

const addVerticalDirectionField = (
  fields: AdaptiveMagicFixField[],
  stitchLineId: string,
  field: 'rightStitchDirection' | 'leftStitchDirection',
  initialValue: VerticalStitchDirectionSchema,
): void => {
  fields.push({
    type: 'vertical-direction',
    path: ['stitchLines', stitchLineId, field],
    initialValue,
    alternativeValue: initialValue === 'top-to-bottom' ? 'bottom-to-top' : 'top-to-bottom',
  })
}

const getComponentConfig = (input: MagicFixBaseInput, componentId: string): MagicFixComponentConfigSchema => {
  const config = input.config.componentConfigs[componentId]
  if (!isDefined(config)) {
    throw new Error(`Missing Magic Fix component config: "${componentId}"!`)
  }
  return config
}

const getStitchLineConfig = (input: MagicFixBaseInput, stitchLineId: string): MagicFixStitchLineConfigSchema => {
  const config = input.config.stitchLineConfigs[stitchLineId]
  if (!isDefined(config)) {
    throw new Error(`Missing Magic Fix stitch line config: "${stitchLineId}"!`)
  }
  return config
}
