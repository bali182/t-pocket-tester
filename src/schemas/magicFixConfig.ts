export type MagicFixEffortSchema = 'low' | 'medium' | 'high'

export type MagicFixConfigSchema = {
  /** How many iterations are we willing to run. Easier to understand for the user, needs to be mapped to real values. */
  effort: MagicFixEffortSchema
  /**
   * How many millimeters off from the targets are we ok with.
   * Example: 0.0001 -> We are ok with stitchlines being 0.0001mm of from the desired coordinate
   */
  accuracy: number
  /** Configuration for individual components */
  componentConfigs: Record<string, MagicFixComponentConfigSchema>
  /** Configuration for individual stitch lines */
  stitchLineConfigs: Record<string, MagicFixStitchLineConfigSchema>
}

export type MagicFixHasDimensionsConfigSchema = {
  /** Allows changing width of fixed width components. */
  canResizeFixedWidth: boolean
  /** Allows changing height of fixed height components. */
  canResizeFixedHeight: boolean
  /** Allows for component dimensions to increase. Can limit the direction of dimension changes. */
  canGrow: boolean
  /** Allows for component dimensions to decrease. Can limit the direction of dimension changes.  */
  canShrink: boolean
}

export type MagicFixHasCornerRadiusConfigSchema = {
  /** Allows changing the top left corner radius on components */
  canChangeTopLeftRadius: boolean
  /** Allows changing the top right corner radius on components */
  canChangeTopRightRadius: boolean
  /** Allows changing the bottom left corner radius on components */
  canChangeBottomLeftRadius: boolean
  /** Allows changing the bottom right corner radius on components */
  canChangeBottomRightRadius: boolean
}

export type MagicFixRootPanelConfigSchema = MagicFixHasDimensionsConfigSchema &
  MagicFixHasCornerRadiusConfigSchema & {
    type: 'magic-fix-root-panel-config'
    /** Allows changing the gaps in layouts */
    canResizeGap: boolean
  }

export type MagicFixPanelConfigSchema = MagicFixHasDimensionsConfigSchema &
  MagicFixHasCornerRadiusConfigSchema & {
    type: 'magic-fix-panel-config'
    /** Allows changing the gaps in layouts */
    canResizeGap: boolean
    /** Allows converting auto (fill) width to fixed width in order to avoid resizing parent */
    canConvertToFixedWidth: boolean
    /** Allows converting auto (fill) height to fixed height in order to avoid resizing parent */
    canConvertToFixedHeight: boolean
  }

export type MagicFixPocketClusterConfigSchema = MagicFixHasDimensionsConfigSchema &
  MagicFixHasCornerRadiusConfigSchema & {
    type: 'magic-fix-pocket-cluster-config'
    /** Allows changing pocketStep of pocket clusters */
    canResizePocketStep: boolean
  }

export type MagicFixComponentConfigSchema =
  | MagicFixRootPanelConfigSchema
  | MagicFixPanelConfigSchema
  | MagicFixPocketClusterConfigSchema

export type MagicFixComponentBoundsStitchLineConfigSchema = {
  type: 'magic-fix-component-bounds-stitch-line-config'

  /** Allows moving the start offset of top stitch line (if exist) */
  canMoveTopStartOffset: boolean
  /** Allows moving the end offset of top stitch line (if exist) */
  canMoveTopEndOffset: boolean
  /** Allows moving the start offset of right stitch line (if exist) */
  canMoveRightStartOffset: boolean
  /** Allows moving the end offset of right stitch line (if exist) */
  canMoveRightEndOffset: boolean
  /** Allows moving the start offset of bottom stitch line (if exist) */
  canMoveBottomStartOffset: boolean
  /** Allows moving the end offset of bottom stitch line (if exist) */
  canMoveBottomEndOffset: boolean
  /** Allows moving the start offset of left stitch line (if exist) */
  canMoveLeftStartOffset: boolean
  /** Allows moving the end offset of left stitch line (if exist) */
  canMoveLeftEndOffset: boolean

  /** Allows flipping the direction of the top stitch line (if exist) */
  canFlipTopStitchDirection: boolean
  /** Allows flipping the direction of the right stitch line (if exist) */
  canFlipRightStitchDirection: boolean
  /** Allows flipping the direction of the bottom stitch line (if exist) */
  canFlipBottomStitchDirection: boolean
  /** Allows flipping the direction of the left stitch line (if exist) */
  canFlipLeftStitchDirection: boolean
}

export type MagicFixPocketClusterStitchLineConfigSchema = {
  type: 'magic-fix-pocket-cluster-stitch-line-config'
  /** Allows moving the start offset */
  canMoveStartOffset: boolean
  /** Allows moving the end offset */
  canMoveEndOffset: boolean
  /** Allows flipping the direction */
  canFlipStitchDirection: boolean
}

export type MagicFixStitchLineConfigSchema =
  | MagicFixComponentBoundsStitchLineConfigSchema
  | MagicFixPocketClusterStitchLineConfigSchema
