import BigNumber from 'bignumber.js'
import type { MagicFixNumericRangeSchema } from '../../../../schemas/magicFixConfig'
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

export const getAdjustableFields = (input: MagicFixBaseInput, bandCount: number): AdaptiveMagicFixField[] => {
  return getAdjustablePaths(input).map((path) => getAdjustableField(input, path, bandCount))
}

const getAdjustableField = (
  input: MagicFixBaseInput,
  path: AdaptiveMagicFixFieldPath,
  bandCount: number,
): AdaptiveMagicFixField => {
  switch (path[0]) {
    case 'root-panel':
      return getRootPanelField(input, path, bandCount)
    case 'panel':
      return getPanelField(input, path, bandCount)
    case 'pocket-cluster':
      return getPocketClusterField(input, path, bandCount)
    case 'component-bounds-stitch-line':
      return getComponentBoundsStitchLineField(input, path, bandCount)
    case 'pocket-cluster-stitch-line':
      return getPocketClusterStitchLineField(input, path, bandCount)
  }
}

const getRootPanelField = (
  input: MagicFixBaseInput,
  path: RootPanelFieldPath,
  bandCount: number,
): AdaptiveMagicFixField => {
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
      return createNumericField(path, component.width, config.fixedWidthRange, bandCount)
    case 'height':
      return createNumericField(path, component.height, config.fixedHeightRange, bandCount)
    case 'layoutGap':
      return createNumericField(path, component.layoutGap, config.layoutGapRange, bandCount)
    case 'borderRadius':
      return createNumericField(path, component.borderRadius, config.borderRadiusRange, bandCount)
    case 'individualRadii':
      return { type: 'boolean', path, initialValue: component.individualRadii }
    case 'topLeftRadius':
      return createNumericField(path, component.topLeftRadius, config.topLeftRadiusRange, bandCount)
    case 'topRightRadius':
      return createNumericField(path, component.topRightRadius, config.topRightRadiusRange, bandCount)
    case 'bottomRightRadius':
      return createNumericField(path, component.bottomRightRadius, config.bottomRightRadiusRange, bandCount)
    case 'bottomLeftRadius':
      return createNumericField(path, component.bottomLeftRadius, config.bottomLeftRadiusRange, bandCount)
  }
}

const getPanelField = (input: MagicFixBaseInput, path: PanelFieldPath, bandCount: number): AdaptiveMagicFixField => {
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
      return createNumericField(path, component.width, config.fixedWidthRange, bandCount)
    case 'height':
      return createNumericField(path, component.height, config.fixedHeightRange, bandCount)
    case 'autoWidth':
      return { type: 'boolean', path, initialValue: component.autoWidth }
    case 'autoHeight':
      return { type: 'boolean', path, initialValue: component.autoHeight }
    case 'layoutGap':
      return createNumericField(path, component.layoutGap, config.layoutGapRange, bandCount)
    case 'borderRadius':
      return createNumericField(path, component.borderRadius, config.borderRadiusRange, bandCount)
    case 'individualRadii':
      return { type: 'boolean', path, initialValue: component.individualRadii }
    case 'topLeftRadius':
      return createNumericField(path, component.topLeftRadius, config.topLeftRadiusRange, bandCount)
    case 'topRightRadius':
      return createNumericField(path, component.topRightRadius, config.topRightRadiusRange, bandCount)
    case 'bottomRightRadius':
      return createNumericField(path, component.bottomRightRadius, config.bottomRightRadiusRange, bandCount)
    case 'bottomLeftRadius':
      return createNumericField(path, component.bottomLeftRadius, config.bottomLeftRadiusRange, bandCount)
  }
}

const getPocketClusterField = (
  input: MagicFixBaseInput,
  path: PocketClusterFieldPath,
  bandCount: number,
): AdaptiveMagicFixField => {
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
      return createNumericField(path, component.width, config.fixedWidthRange, bandCount)
    case 'height':
      return createNumericField(path, component.height, config.fixedHeightRange, bandCount)
    case 'autoWidth':
      return { type: 'boolean', path, initialValue: component.autoWidth }
    case 'autoHeight':
      return { type: 'boolean', path, initialValue: component.autoHeight }
    case 'pocketStep':
      return createNumericField(path, component.pocketStep, config.pocketStepRange, bandCount)
    case 'borderRadius':
      return createNumericField(path, component.borderRadius, config.borderRadiusRange, bandCount)
    case 'individualRadii':
      return { type: 'boolean', path, initialValue: component.individualRadii }
    case 'topLeftRadius':
      return createNumericField(path, component.topLeftRadius, config.topLeftRadiusRange, bandCount)
    case 'topRightRadius':
      return createNumericField(path, component.topRightRadius, config.topRightRadiusRange, bandCount)
    case 'bottomRightRadius':
      return createNumericField(path, component.bottomRightRadius, config.bottomRightRadiusRange, bandCount)
    case 'bottomLeftRadius':
      return createNumericField(path, component.bottomLeftRadius, config.bottomLeftRadiusRange, bandCount)
  }
}

const getComponentBoundsStitchLineField = (
  input: MagicFixBaseInput,
  path: ComponentBoundsStitchLineFieldPath,
  bandCount: number,
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
      return createNumericField(path, stitchLine.topStartOffset, config.topStartOffsetRange, bandCount)
    case 'topEndOffset':
      return createNumericField(path, stitchLine.topEndOffset, config.topEndOffsetRange, bandCount)
    case 'rightStartOffset':
      return createNumericField(path, stitchLine.rightStartOffset, config.rightStartOffsetRange, bandCount)
    case 'rightEndOffset':
      return createNumericField(path, stitchLine.rightEndOffset, config.rightEndOffsetRange, bandCount)
    case 'bottomStartOffset':
      return createNumericField(path, stitchLine.bottomStartOffset, config.bottomStartOffsetRange, bandCount)
    case 'bottomEndOffset':
      return createNumericField(path, stitchLine.bottomEndOffset, config.bottomEndOffsetRange, bandCount)
    case 'leftStartOffset':
      return createNumericField(path, stitchLine.leftStartOffset, config.leftStartOffsetRange, bandCount)
    case 'leftEndOffset':
      return createNumericField(path, stitchLine.leftEndOffset, config.leftEndOffsetRange, bandCount)
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
  bandCount: number,
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
      return createNumericField(path, stitchLine.startOffset, config.startOffsetRange, bandCount)
    case 'endOffset':
      return createNumericField(path, stitchLine.endOffset, config.endOffsetRange, bandCount)
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
  bandCount: number,
): AdaptiveMagicFixNumericField => {
  const minValue = new BigNumber(currentValue).minus(range.maxDecrease)
  const maxValue = new BigNumber(currentValue).plus(range.maxIncrease)
  const bandWidth = maxValue.minus(minValue).dividedBy(bandCount)

  return {
    type: 'numeric',
    path,
    minValue,
    maxValue,
    bands: Array.from({ length: bandCount }, (_, index) => ({
      minValue: minValue.plus(bandWidth.times(index)),
      maxValue: index === bandCount - 1 ? maxValue : minValue.plus(bandWidth.times(index + 1)),
    })),
  }
}

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
