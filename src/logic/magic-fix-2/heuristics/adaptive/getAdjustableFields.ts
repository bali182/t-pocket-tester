import type { HasCornerRadiusSchema } from '../../../../schemas/common'
import type {
  MagicFixHasCornerRadiusConfigSchema,
  MagicFixNumericRangeSchema,
} from '../../../../schemas/magicFixConfig'
import type { MagicFixBaseInput } from '../../../../schemas/magicFixHeuristics'
import type { HorizontalStitchDirectionSchema, VerticalStitchDirectionSchema } from '../../../../schemas/stitching'
import { isDefined } from '../../../../utils/isDefined'
import { getAdjustablePaths } from './getAdjustablePaths'
import type {
  AdaptiveMagicFixField,
  AdaptiveMagicFixFieldPath,
  AdaptiveMagicFixHorizontalDirectionField,
  AdaptiveMagicFixNumericField,
  AdaptiveMagicFixVerticalDirectionField,
  ComponentBoundsStitchLineFieldPath,
  PanelFieldPath,
  PocketClusterFieldPath,
  PocketClusterStitchLineFieldPath,
  RootPanelFieldPath,
} from './types'
import { getMagicFixComponentConfig, getMagicFixStitchLineConfig } from './utils/getMagicFixConfigEntry'

export const getAdjustableFields = (input: MagicFixBaseInput): AdaptiveMagicFixField[] => {
  return getAdjustablePaths(input).map((path) => getAdjustableField(input, path))
}

const getAdjustableField = (input: MagicFixBaseInput, path: AdaptiveMagicFixFieldPath): AdaptiveMagicFixField => {
  switch (path[0]) {
    case 'root-panel':
      return getRootPanelField(input, path)
    case 'panel':
      return getPanelField(input, path)
    case 'pocket-cluster':
      return getPocketClusterField(input, path)
    case 'component-bounds-stitch-line':
      return getComponentBoundsStitchLineField(input, path)
    case 'pocket-cluster-stitch-line':
      return getPocketClusterStitchLineField(input, path)
  }
}

const getRootPanelField = (input: MagicFixBaseInput, path: RootPanelFieldPath): AdaptiveMagicFixField => {
  const component = input.subProject.components[path[1]]
  if (!isDefined(component)) {
    throw new Error(`Missing component: "${path[1]}"!`)
  }
  if (component.type !== 'root-panel') {
    throw new Error(`Invalid component type: "${path[1]}"!`)
  }
  const config = getMagicFixComponentConfig(input.config, component.id)
  if (config.type !== 'magic-fix-root-panel-config') {
    throw new Error(`Invalid Magic Fix config for root panel: "${component.id}"!`)
  }

  switch (path[2]) {
    case 'width':
      return createNumericField(path, component.width, config.fixedWidthRange)
    case 'height':
      return createNumericField(path, component.height, config.fixedHeightRange)
    case 'layoutGap':
      return createNumericField(path, component.layoutGap, config.layoutGapRange)
    case 'borderRadius':
      return createNumericField(path, component.borderRadius, config.borderRadiusRange)
    case 'individualRadii':
      return { type: 'boolean', path, initialValue: component.individualRadii }
    default:
      return getCornerRadiusField(path, component, config)
  }
}

const getPanelField = (input: MagicFixBaseInput, path: PanelFieldPath): AdaptiveMagicFixField => {
  const component = input.subProject.components[path[1]]
  if (!isDefined(component)) {
    throw new Error(`Missing component: "${path[1]}"!`)
  }
  if (component.type !== 'panel') {
    throw new Error(`Invalid component type: "${path[1]}"!`)
  }
  const config = getMagicFixComponentConfig(input.config, component.id)
  if (config.type !== 'magic-fix-panel-config') {
    throw new Error(`Invalid Magic Fix config for panel: "${component.id}"!`)
  }

  switch (path[2]) {
    case 'width':
      return createNumericField(path, component.width, config.fixedWidthRange)
    case 'height':
      return createNumericField(path, component.height, config.fixedHeightRange)
    case 'autoWidth':
      return { type: 'boolean', path, initialValue: component.autoWidth }
    case 'autoHeight':
      return { type: 'boolean', path, initialValue: component.autoHeight }
    case 'layoutGap':
      return createNumericField(path, component.layoutGap, config.layoutGapRange)
    case 'borderRadius':
      return createNumericField(path, component.borderRadius, config.borderRadiusRange)
    case 'individualRadii':
      return { type: 'boolean', path, initialValue: component.individualRadii }
    default:
      return getCornerRadiusField(path, component, config)
  }
}

const getPocketClusterField = (input: MagicFixBaseInput, path: PocketClusterFieldPath): AdaptiveMagicFixField => {
  const component = input.subProject.components[path[1]]
  if (!isDefined(component)) {
    throw new Error(`Missing component: "${path[1]}"!`)
  }
  if (component.type !== 'pocket-cluster') {
    throw new Error(`Invalid component type: "${path[1]}"!`)
  }
  const config = getMagicFixComponentConfig(input.config, component.id)
  if (config.type !== 'magic-fix-pocket-cluster-config') {
    throw new Error(`Invalid Magic Fix config for pocket cluster: "${component.id}"!`)
  }

  switch (path[2]) {
    case 'width':
      return createNumericField(path, component.width, config.fixedWidthRange)
    case 'height':
      return createNumericField(path, component.height, config.fixedHeightRange)
    case 'autoWidth':
      return { type: 'boolean', path, initialValue: component.autoWidth }
    case 'autoHeight':
      return { type: 'boolean', path, initialValue: component.autoHeight }
    case 'pocketStep':
      return createNumericField(path, component.pocketStep, config.pocketStepRange)
    case 'borderRadius':
      return createNumericField(path, component.borderRadius, config.borderRadiusRange)
    case 'individualRadii':
      return { type: 'boolean', path, initialValue: component.individualRadii }
    default:
      return getCornerRadiusField(path, component, config)
  }
}

const getCornerRadiusField = (
  path: AdaptiveMagicFixFieldPath,
  component: HasCornerRadiusSchema,
  config: MagicFixHasCornerRadiusConfigSchema,
): AdaptiveMagicFixNumericField => {
  switch (path[2]) {
    case 'topLeftRadius':
      return createNumericField(path, component.topLeftRadius, config.topLeftRadiusRange)
    case 'topRightRadius':
      return createNumericField(path, component.topRightRadius, config.topRightRadiusRange)
    case 'bottomRightRadius':
      return createNumericField(path, component.bottomRightRadius, config.bottomRightRadiusRange)
    case 'bottomLeftRadius':
      return createNumericField(path, component.bottomLeftRadius, config.bottomLeftRadiusRange)
    default:
      throw new Error(`Invalid corner radius field: "${path[2]}"!`)
  }
}

const getComponentBoundsStitchLineField = (
  input: MagicFixBaseInput,
  path: ComponentBoundsStitchLineFieldPath,
): AdaptiveMagicFixField => {
  const stitchLine = input.subProject.stitchLines.find((candidate) => candidate.id === path[1])
  if (!isDefined(stitchLine)) {
    throw new Error(`Missing stitch line: "${path[1]}"!`)
  }
  if (stitchLine.type !== 'component-bounds-stitch-line') {
    throw new Error(`Invalid stitch line type: "${path[1]}"!`)
  }
  const config = getMagicFixStitchLineConfig(input.config, stitchLine.id)
  if (config.type !== 'magic-fix-component-bounds-stitch-line-config') {
    throw new Error(`Invalid Magic Fix config for component bounds stitch line: "${stitchLine.id}"!`)
  }

  switch (path[2]) {
    case 'topStartOffset':
      return createNumericField(path, stitchLine.topStartOffset, config.topStartOffsetRange)
    case 'topEndOffset':
      return createNumericField(path, stitchLine.topEndOffset, config.topEndOffsetRange)
    case 'rightStartOffset':
      return createNumericField(path, stitchLine.rightStartOffset, config.rightStartOffsetRange)
    case 'rightEndOffset':
      return createNumericField(path, stitchLine.rightEndOffset, config.rightEndOffsetRange)
    case 'bottomStartOffset':
      return createNumericField(path, stitchLine.bottomStartOffset, config.bottomStartOffsetRange)
    case 'bottomEndOffset':
      return createNumericField(path, stitchLine.bottomEndOffset, config.bottomEndOffsetRange)
    case 'leftStartOffset':
      return createNumericField(path, stitchLine.leftStartOffset, config.leftStartOffsetRange)
    case 'leftEndOffset':
      return createNumericField(path, stitchLine.leftEndOffset, config.leftEndOffsetRange)
    case 'topStitchDirection':
    case 'bottomStitchDirection':
      return createHorizontalDirectionField(path, stitchLine[path[2]])
    case 'rightStitchDirection':
    case 'leftStitchDirection':
      return createVerticalDirectionField(path, stitchLine[path[2]])
  }
}

const getPocketClusterStitchLineField = (
  input: MagicFixBaseInput,
  path: PocketClusterStitchLineFieldPath,
): AdaptiveMagicFixField => {
  const stitchLine = input.subProject.stitchLines.find((candidate) => candidate.id === path[1])
  if (!isDefined(stitchLine)) {
    throw new Error(`Missing stitch line: "${path[1]}"!`)
  }
  if (stitchLine.type !== 'pocket-cluster-stitch-line') {
    throw new Error(`Invalid stitch line type: "${path[1]}"!`)
  }
  const config = getMagicFixStitchLineConfig(input.config, stitchLine.id)
  if (config.type !== 'magic-fix-pocket-cluster-stitch-line-config') {
    throw new Error(`Invalid Magic Fix config for pocket cluster stitch line: "${stitchLine.id}"!`)
  }

  switch (path[2]) {
    case 'startOffset':
      return createNumericField(path, stitchLine.startOffset, config.startOffsetRange)
    case 'endOffset':
      return createNumericField(path, stitchLine.endOffset, config.endOffsetRange)
    case 'stitchDirection':
      return {
        type: 'pocket-cluster-direction',
        path,
        initialValue: stitchLine.stitchDirection,
        alternativeValue: stitchLine.stitchDirection === 'start-to-end' ? 'end-to-start' : 'start-to-end',
      }
  }
}

const createNumericField = (
  path: AdaptiveMagicFixFieldPath,
  currentValue: number,
  range: MagicFixNumericRangeSchema,
): AdaptiveMagicFixNumericField => ({
  type: 'numeric',
  path,
  minValue: currentValue - range.maxDecrease,
  maxValue: currentValue + range.maxIncrease,
})

const createHorizontalDirectionField = (
  path: AdaptiveMagicFixFieldPath,
  initialValue: HorizontalStitchDirectionSchema,
): AdaptiveMagicFixHorizontalDirectionField => ({
  type: 'horizontal-direction',
  path,
  initialValue,
  alternativeValue: initialValue === 'left-to-right' ? 'right-to-left' : 'left-to-right',
})

const createVerticalDirectionField = (
  path: AdaptiveMagicFixFieldPath,
  initialValue: VerticalStitchDirectionSchema,
): AdaptiveMagicFixVerticalDirectionField => ({
  type: 'vertical-direction',
  path,
  initialValue,
  alternativeValue: initialValue === 'top-to-bottom' ? 'bottom-to-top' : 'top-to-bottom',
})
