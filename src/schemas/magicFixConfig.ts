import { HasComponentReferenceSchema, HasStitchLineReferenceSchema } from './common'

export type MagicFixEffortSchema = 'low' | 'medium' | 'high'

export type MagicFixNumericRangeSchema = {
  maxDecrease: number
  maxIncrease: number
}

export type MagicFixBaseConfigSchema = {
  effort: MagicFixEffortSchema
  accuracy: number
}

export type MagicFixConfigSchema = MagicFixBaseConfigSchema & {
  componentConfigs: Record<string, MagicFixComponentConfigSchema>
  stitchLineConfigs: Record<string, MagicFixStitchLineConfigSchema>
}

export type MagicFixHasPreferredMinimumDistanceFromEdgeConfigSchema = {
  preferredMinimumDistanceFromEdge: number
}

export type MagicFixHasDimensionsConfigSchema = {
  fixedWidthRange: MagicFixNumericRangeSchema
  fixedHeightRange: MagicFixNumericRangeSchema
}

export type MagicFixHasAutoDimensionsConfigSchema = {
  canConvertToFixedWidth: boolean
  canConvertToFixedHeight: boolean
}

export type MagicFixHasGapConfigSchema = {
  layoutGapRange: MagicFixNumericRangeSchema
}

export type MagicFixHasCornerRadiusConfigSchema = {
  /**
   * Required only when per-corner radius changes are requested on a component
   * whose individualRadii is currently false.
   */
  canConvertToIndividualRadii: boolean
  borderRadiusRange: MagicFixNumericRangeSchema
  topLeftRadiusRange: MagicFixNumericRangeSchema
  topRightRadiusRange: MagicFixNumericRangeSchema
  bottomRightRadiusRange: MagicFixNumericRangeSchema
  bottomLeftRadiusRange: MagicFixNumericRangeSchema
}

export type MagicFixRootPanelConfigSchema = HasComponentReferenceSchema &
  MagicFixHasDimensionsConfigSchema &
  MagicFixHasGapConfigSchema &
  MagicFixHasCornerRadiusConfigSchema &
  MagicFixHasPreferredMinimumDistanceFromEdgeConfigSchema & {
    type: 'magic-fix-root-panel-config'
  }

export type MagicFixPanelConfigSchema = HasComponentReferenceSchema &
  MagicFixHasDimensionsConfigSchema &
  MagicFixHasGapConfigSchema &
  MagicFixHasCornerRadiusConfigSchema &
  MagicFixHasAutoDimensionsConfigSchema &
  MagicFixHasPreferredMinimumDistanceFromEdgeConfigSchema & {
    type: 'magic-fix-panel-config'
  }

export type MagicFixPocketClusterConfigSchema = HasComponentReferenceSchema &
  MagicFixHasDimensionsConfigSchema &
  MagicFixHasCornerRadiusConfigSchema &
  MagicFixHasAutoDimensionsConfigSchema &
  MagicFixHasPreferredMinimumDistanceFromEdgeConfigSchema & {
    type: 'magic-fix-pocket-cluster-config'
    pocketStepRange: MagicFixNumericRangeSchema
  }

export type MagicFixComponentConfigSchema =
  | MagicFixRootPanelConfigSchema
  | MagicFixPanelConfigSchema
  | MagicFixPocketClusterConfigSchema

export type MagicFixComponentBoundsStitchLineConfigSchema = HasStitchLineReferenceSchema & {
  type: 'magic-fix-component-bounds-stitch-line-config'

  topStartOffsetRange: MagicFixNumericRangeSchema
  topEndOffsetRange: MagicFixNumericRangeSchema
  rightStartOffsetRange: MagicFixNumericRangeSchema
  rightEndOffsetRange: MagicFixNumericRangeSchema
  bottomStartOffsetRange: MagicFixNumericRangeSchema
  bottomEndOffsetRange: MagicFixNumericRangeSchema
  leftStartOffsetRange: MagicFixNumericRangeSchema
  leftEndOffsetRange: MagicFixNumericRangeSchema

  canFlipTopStitchDirection: boolean
  canFlipRightStitchDirection: boolean
  canFlipBottomStitchDirection: boolean
  canFlipLeftStitchDirection: boolean
}

export type MagicFixPocketClusterStitchLineConfigSchema = HasStitchLineReferenceSchema & {
  type: 'magic-fix-pocket-cluster-stitch-line-config'
  startOffsetRange: MagicFixNumericRangeSchema
  endOffsetRange: MagicFixNumericRangeSchema
  canFlipStitchDirection: boolean
}

export type MagicFixStitchLineConfigSchema =
  | MagicFixComponentBoundsStitchLineConfigSchema
  | MagicFixPocketClusterStitchLineConfigSchema

/** Used on the UI editor to edit the basics, and some commonly shared fields */
export type MagicFixBasicUIConfigSchema = {
  preferredMinimumDistanceFromEdge: number | undefined
  modifyRange: Partial<MagicFixNumericRangeSchema>
}
