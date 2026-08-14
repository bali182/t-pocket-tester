import {
  MagicFixComponentConfigSchema,
  MagicFixConfigSchema,
  MagicFixHasAutoDimensionsConfigSchema,
  MagicFixHasCornerRadiusConfigSchema,
  MagicFixHasDimensionsConfigSchema,
  MagicFixHasGapConfigSchema,
  MagicFixHasPreferredMinimumDistanceFromEdgeConfigSchema,
  MagicFixNumericRangeSchema,
  MagicFixStitchLineConfigSchema,
} from '../schemas/magicFixConfig'
import { ProjectSchema } from '../schemas/project'
import { SubProjectSchema } from '../schemas/subProject'

const DEFAULT_ACCURACY = 0.01

export const createMagicFixConfig = (project: ProjectSchema, subProject: SubProjectSchema): MagicFixConfigSchema => {
  return {
    accuracy: DEFAULT_ACCURACY,
    effort: 'medium',
    componentConfigs: createComponentConfigs(project, subProject),
    stitchLineConfigs: createStitchLineConfigs(project, subProject),
  }
}

const createComponentConfigs = (
  project: ProjectSchema,
  subProject: SubProjectSchema,
): Record<string, MagicFixComponentConfigSchema> => {
  const components = Object.values(subProject.components)
  const halfStitchLineLength = project.stitchingSettings.stitchHoleDistance / 2
  const disabledRange: MagicFixNumericRangeSchema = { maxDecrease: 0, maxIncrease: 0 }
  const halfStitchLineRange: MagicFixNumericRangeSchema = {
    maxDecrease: halfStitchLineLength,
    maxIncrease: halfStitchLineLength,
  }
  const defaultBorderRadiusProps: MagicFixHasCornerRadiusConfigSchema = {
    canConvertToIndividualRadii: false,
    borderRadiusRange: disabledRange,
    bottomRightRadiusRange: disabledRange,
    bottomLeftRadiusRange: disabledRange,
    topLeftRadiusRange: disabledRange,
    topRightRadiusRange: disabledRange,
  }
  const defaultDimensionProps: MagicFixHasDimensionsConfigSchema = {
    fixedHeightRange: halfStitchLineRange,
    fixedWidthRange: halfStitchLineRange,
  }
  const layoutGapRange: MagicFixHasGapConfigSchema = {
    layoutGapRange: halfStitchLineRange,
  }
  const distanceToEdge: MagicFixHasPreferredMinimumDistanceFromEdgeConfigSchema = {
    preferredMinimumDistanceFromEdge: halfStitchLineLength,
  }
  const defaultConvertAuto: MagicFixHasAutoDimensionsConfigSchema = {
    canConvertToFixedHeight: false,
    canConvertToFixedWidth: false,
  }

  const configs = components.map((component): MagicFixComponentConfigSchema => {
    switch (component.type) {
      case 'root-panel':
        return {
          ...defaultBorderRadiusProps,
          ...defaultDimensionProps,
          ...layoutGapRange,
          ...distanceToEdge,
          type: 'magic-fix-root-panel-config',
          componentId: component.id,
        }
      case 'panel':
        return {
          ...defaultBorderRadiusProps,
          ...defaultDimensionProps,
          ...layoutGapRange,
          ...distanceToEdge,
          ...defaultConvertAuto,
          type: 'magic-fix-panel-config',
          componentId: component.id,
        }
      case 'pocket-cluster':
        return {
          ...defaultBorderRadiusProps,
          ...defaultDimensionProps,
          ...distanceToEdge,
          ...defaultConvertAuto,
          pocketStepRange: halfStitchLineRange,
          type: 'magic-fix-pocket-cluster-config',
          componentId: component.id,
        }
    }
  })

  return configs.reduce(
    (collector, config) => ({ ...collector, [config.componentId]: config }),
    {} as Record<string, MagicFixComponentConfigSchema>,
  )
}

const createStitchLineConfigs = (
  project: ProjectSchema,
  subProject: SubProjectSchema,
): Record<string, MagicFixStitchLineConfigSchema> => {
  const halfStitchLineLength = project.stitchingSettings.stitchHoleDistance / 2
  const halfStitchLineRange: MagicFixNumericRangeSchema = {
    maxDecrease: halfStitchLineLength,
    maxIncrease: halfStitchLineLength,
  }

  const configs = subProject.stitchLines.map((stitchLine): MagicFixStitchLineConfigSchema => {
    switch (stitchLine.type) {
      case 'component-bounds-stitch-line':
        return {
          type: 'magic-fix-component-bounds-stitch-line-config',
          stitchLineId: stitchLine.id,
          topStartOffsetRange: halfStitchLineRange,
          topEndOffsetRange: halfStitchLineRange,

          rightStartOffsetRange: halfStitchLineRange,
          rightEndOffsetRange: halfStitchLineRange,

          bottomStartOffsetRange: halfStitchLineRange,
          bottomEndOffsetRange: halfStitchLineRange,

          leftStartOffsetRange: halfStitchLineRange,
          leftEndOffsetRange: halfStitchLineRange,

          canFlipBottomStitchDirection: true,
          canFlipLeftStitchDirection: true,
          canFlipRightStitchDirection: true,
          canFlipTopStitchDirection: true,
        }
      case 'pocket-cluster-stitch-line':
        return {
          type: 'magic-fix-pocket-cluster-stitch-line-config',
          stitchLineId: stitchLine.id,
          startOffsetRange: halfStitchLineRange,
          endOffsetRange: halfStitchLineRange,
          canFlipStitchDirection: true,
        }
    }
  })

  return configs.reduce(
    (collector, config) => ({ ...collector, [config.stitchLineId]: config }),
    {} as Record<string, MagicFixStitchLineConfigSchema>,
  )
}
