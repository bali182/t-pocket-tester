export type MagicFixEffortSchema = 'low' | 'medium' | 'high'

export type MagicFixConfigSchema = {
  /** How many iterations are we willing to run. Easier to understand for the user, needs to be mapped to real values. */
  effort: MagicFixEffortSchema
  /**
   * How many millimeters off from the targets are we ok with.
   * Example: 0.0001 -> We are ok with stitchlines being 0.0001mm of from the desired coordinate
   */
  accuracy: number

  /** Allows changing width of fixed width components. */
  canResizeFixedWidth: boolean
  /** Allows changing height of fixed height components. */
  canResizeFixedHeight: boolean
  /** Allows changing the gaps in layouts */
  canResizeGap: boolean
  /** Allows changing pocketStep of pocket clusters */
  canResizePocketStep: boolean
  /** Allows moving the start offset of non-joined stitchline starting points */
  canMoveStitchLineStartOffset: boolean
  /** Allows moving the end offset of non-joined stitchline end points */
  canMoveStitchLineEndOffset: boolean
  /** Allows changing the corner radius on components */
  canChangeCornerRadius: boolean

  /** Allows converting auto (fill) width to fixed width in order to avoid resizing parent */
  canConvertToFixedWidth: boolean
  /** Allows converting auto (fill) height to fixed height in order to avoid resizing parent */
  canConvertToFixedHeight: boolean

  /** Allows for component dimensions to increase */
  canGrow: boolean
  /** Allows for component dimensions to decrease */
  canShrink: boolean
}
