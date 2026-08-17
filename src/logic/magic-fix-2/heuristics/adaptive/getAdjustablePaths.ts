import type { ComponentSchema } from '../../../../schemas/components'
import type {
  MagicFixComponentConfigSchema,
  MagicFixHasCornerRadiusConfigSchema,
  MagicFixNumericRangeSchema,
  MagicFixStitchLineConfigSchema,
} from '../../../../schemas/magicFixConfig'
import type { MagicFixBaseInput } from '../../../../schemas/magicFixHeuristics'
import type { StitchLineSchema } from '../../../../schemas/stitching'
import type { AdaptiveMagicFixFieldPath } from './types'
import { getMagicFixComponentConfig, getMagicFixStitchLineConfig } from './utils/getMagicFixConfigEntry'

export const getAdjustablePaths = (input: MagicFixBaseInput): AdaptiveMagicFixFieldPath[] => {
  const paths: AdaptiveMagicFixFieldPath[] = []

  for (const component of Object.values(input.subProject.components)) {
    addComponentPaths(paths, component, getMagicFixComponentConfig(input.config, component.id))
  }

  for (const stitchLine of input.subProject.stitchLines) {
    addStitchLinePaths(paths, stitchLine, getMagicFixStitchLineConfig(input.config, stitchLine.id))
  }

  return paths
}

const addComponentPaths = (
  paths: AdaptiveMagicFixFieldPath[],
  component: ComponentSchema,
  config: MagicFixComponentConfigSchema,
): void => {
  switch (component.type) {
    case 'root-panel': {
      if (config.type !== 'magic-fix-root-panel-config') {
        throw new Error(`Invalid Magic Fix config for root panel: "${component.id}"!`)
      }
      addNumericPath(paths, [component.type, component.id, 'width'], config.fixedWidthRange)
      addNumericPath(paths, [component.type, component.id, 'height'], config.fixedHeightRange)
      addNumericPath(paths, [component.type, component.id, 'layoutGap'], config.layoutGapRange)
      addCornerRadiusPaths(paths, component.type, component.id, component.individualRadii, config)
      break
    }
    case 'panel': {
      if (config.type !== 'magic-fix-panel-config') {
        throw new Error(`Invalid Magic Fix config for panel: "${component.id}"!`)
      }
      addFillableDimensionPaths(
        paths,
        component.type,
        component.id,
        'width',
        component.autoWidth,
        config.canConvertToFixedWidth,
        config.fixedWidthRange,
      )
      addFillableDimensionPaths(
        paths,
        component.type,
        component.id,
        'height',
        component.autoHeight,
        config.canConvertToFixedHeight,
        config.fixedHeightRange,
      )
      addNumericPath(paths, [component.type, component.id, 'layoutGap'], config.layoutGapRange)
      addCornerRadiusPaths(paths, component.type, component.id, component.individualRadii, config)
      break
    }
    case 'pocket-cluster': {
      if (config.type !== 'magic-fix-pocket-cluster-config') {
        throw new Error(`Invalid Magic Fix config for pocket cluster: "${component.id}"!`)
      }
      addFillableDimensionPaths(
        paths,
        component.type,
        component.id,
        'width',
        component.autoWidth,
        config.canConvertToFixedWidth,
        config.fixedWidthRange,
      )
      addFillableDimensionPaths(
        paths,
        component.type,
        component.id,
        'height',
        component.autoHeight,
        config.canConvertToFixedHeight,
        config.fixedHeightRange,
      )
      addNumericPath(paths, [component.type, component.id, 'pocketStep'], config.pocketStepRange)
      addCornerRadiusPaths(paths, component.type, component.id, component.individualRadii, config)
      break
    }
  }
}

const addFillableDimensionPaths = (
  paths: AdaptiveMagicFixFieldPath[],
  componentType: 'panel' | 'pocket-cluster',
  componentId: string,
  dimension: 'width' | 'height',
  isAuto: boolean,
  canConvertToFixed: boolean,
  range: MagicFixNumericRangeSchema,
): void => {
  if (isAuto && !canConvertToFixed) {
    return
  }
  if (isAuto) {
    paths.push([componentType, componentId, dimension === 'width' ? 'autoWidth' : 'autoHeight'])
  }
  addNumericPath(paths, [componentType, componentId, dimension], range)
}

const addCornerRadiusPaths = (
  paths: AdaptiveMagicFixFieldPath[],
  componentType: 'root-panel' | 'panel' | 'pocket-cluster',
  componentId: string,
  individualRadii: boolean,
  config: MagicFixHasCornerRadiusConfigSchema,
): void => {
  if (individualRadii) {
    addIndividualCornerRadiusPaths(paths, componentType, componentId, config)
    return
  }

  addNumericPath(paths, [componentType, componentId, 'borderRadius'], config.borderRadiusRange)
  if (!config.canConvertToIndividualRadii) {
    return
  }

  paths.push([componentType, componentId, 'individualRadii'])
  addIndividualCornerRadiusPaths(paths, componentType, componentId, config)
}

const addIndividualCornerRadiusPaths = (
  paths: AdaptiveMagicFixFieldPath[],
  componentType: 'root-panel' | 'panel' | 'pocket-cluster',
  componentId: string,
  config: MagicFixHasCornerRadiusConfigSchema,
): void => {
  addNumericPath(paths, [componentType, componentId, 'topLeftRadius'], config.topLeftRadiusRange)
  addNumericPath(paths, [componentType, componentId, 'topRightRadius'], config.topRightRadiusRange)
  addNumericPath(paths, [componentType, componentId, 'bottomRightRadius'], config.bottomRightRadiusRange)
  addNumericPath(paths, [componentType, componentId, 'bottomLeftRadius'], config.bottomLeftRadiusRange)
}

const addStitchLinePaths = (
  paths: AdaptiveMagicFixFieldPath[],
  stitchLine: StitchLineSchema,
  config: MagicFixStitchLineConfigSchema,
): void => {
  switch (stitchLine.type) {
    case 'component-bounds-stitch-line': {
      if (config.type !== 'magic-fix-component-bounds-stitch-line-config') {
        throw new Error(`Invalid Magic Fix config for component bounds stitch line: "${stitchLine.id}"!`)
      }
      addNumericPath(paths, [stitchLine.type, stitchLine.id, 'topStartOffset'], config.topStartOffsetRange)
      addNumericPath(paths, [stitchLine.type, stitchLine.id, 'topEndOffset'], config.topEndOffsetRange)
      addNumericPath(paths, [stitchLine.type, stitchLine.id, 'rightStartOffset'], config.rightStartOffsetRange)
      addNumericPath(paths, [stitchLine.type, stitchLine.id, 'rightEndOffset'], config.rightEndOffsetRange)
      addNumericPath(paths, [stitchLine.type, stitchLine.id, 'bottomStartOffset'], config.bottomStartOffsetRange)
      addNumericPath(paths, [stitchLine.type, stitchLine.id, 'bottomEndOffset'], config.bottomEndOffsetRange)
      addNumericPath(paths, [stitchLine.type, stitchLine.id, 'leftStartOffset'], config.leftStartOffsetRange)
      addNumericPath(paths, [stitchLine.type, stitchLine.id, 'leftEndOffset'], config.leftEndOffsetRange)
      if (config.canFlipTopStitchDirection) {
        paths.push([stitchLine.type, stitchLine.id, 'topStitchDirection'])
      }
      if (config.canFlipBottomStitchDirection) {
        paths.push([stitchLine.type, stitchLine.id, 'bottomStitchDirection'])
      }
      if (config.canFlipRightStitchDirection) {
        paths.push([stitchLine.type, stitchLine.id, 'rightStitchDirection'])
      }
      if (config.canFlipLeftStitchDirection) {
        paths.push([stitchLine.type, stitchLine.id, 'leftStitchDirection'])
      }
      break
    }
    case 'pocket-cluster-stitch-line': {
      if (config.type !== 'magic-fix-pocket-cluster-stitch-line-config') {
        throw new Error(`Invalid Magic Fix config for pocket cluster stitch line: "${stitchLine.id}"!`)
      }
      addNumericPath(paths, [stitchLine.type, stitchLine.id, 'startOffset'], config.startOffsetRange)
      addNumericPath(paths, [stitchLine.type, stitchLine.id, 'endOffset'], config.endOffsetRange)
      if (config.canFlipStitchDirection) {
        paths.push([stitchLine.type, stitchLine.id, 'stitchDirection'])
      }
      break
    }
  }
}

const addNumericPath = (
  paths: AdaptiveMagicFixFieldPath[],
  path: AdaptiveMagicFixFieldPath,
  range: MagicFixNumericRangeSchema,
): void => {
  if (range.maxDecrease === 0 && range.maxIncrease === 0) {
    return
  }
  paths.push(path)
}
