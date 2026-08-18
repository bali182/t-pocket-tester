export type MagicFixNumericRangeSchema = {
  maxDecrease: number
  maxIncrease: number
}

export type MagicFixStitchHoleDistanceMultiplierRangeSchema = {
  maxDecreaseMultiplier: number
  maxIncreaseMultiplier: number
}

/** Global settings for magic fix. */
export type MagicFixSettingsSchema = {
  /** How much the result can differ from the targeted value in mm. */
  accuracy: number
  /** How much we are allowed to transform a dimension (width, height, gap, pocketStep) */
  dimensionModifyRange: MagicFixStitchHoleDistanceMultiplierRangeSchema
  /** How much we are allowed to modify an offset */
  stitchLineOffsetModifyRange: MagicFixStitchHoleDistanceMultiplierRangeSchema
  /** Minimum distance from edge in mm of the last stitchHole of a stitchline. */
  minimumEdgeDistance: number
  /** Minimum stitchHoleDistance multiplier for a stitchHole to edge distance where the stitchline crosses an edge. Is between 0 and 0.5 */
  minimumEdgeCrossingMultiplier: number
}
