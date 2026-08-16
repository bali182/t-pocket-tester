import type {
  HasComponentReferenceSchema,
  HasCornerRadiusValuesSchema,
  HasSizeSchema,
  HasStitchLineReferenceSchema,
} from './common'
import type {
  ComponentBoundsStitchLineHorizontalDirectionsSchema,
  ComponentBoundsStitchLineOffsetsSchema,
  ComponentBoundsStitchLineVerticalDirectionsSchema,
  HorizontalStitchDirectionSchema,
  PocketClusterStitchLineOffsetsSchema,
  StitchDirectionSchema,
  VerticalStitchDirectionSchema,
} from './stitching'

export type MagicFixSetComponentDimensionChangeRequest = HasComponentReferenceSchema & {
  type: 'set-component-dimension'
  dimensionField: keyof HasSizeSchema
  value: number
}

export type MagicFixSetLayoutGapChangeRequest = HasComponentReferenceSchema & {
  type: 'set-layout-gap'
  value: number
}

export type MagicFixSetComponentCornerRadiusChangeRequest = HasComponentReferenceSchema & {
  type: 'set-component-corner-radius'
  radiusField: keyof HasCornerRadiusValuesSchema
  value: number
}

export type MagicFixSetPocketStepChangeRequest = HasComponentReferenceSchema & {
  type: 'set-pocket-step'
  value: number
}

export type MagicFixSetComponentBoundsStitchLineOffsetChangeRequest = HasStitchLineReferenceSchema & {
  type: 'set-component-bounds-stitch-line-offset'
  offsetField: keyof ComponentBoundsStitchLineOffsetsSchema
  value: number
}

export type MagicFixSetComponentBoundsStitchLineHorizontalDirectionChangeRequest = HasStitchLineReferenceSchema & {
  type: 'set-component-bounds-stitch-line-horizontal-direction'
  directionField: keyof ComponentBoundsStitchLineHorizontalDirectionsSchema
  value: HorizontalStitchDirectionSchema
}

export type MagicFixSetComponentBoundsStitchLineVerticalDirectionChangeRequest = HasStitchLineReferenceSchema & {
  type: 'set-component-bounds-stitch-line-vertical-direction'
  directionField: keyof ComponentBoundsStitchLineVerticalDirectionsSchema
  value: VerticalStitchDirectionSchema
}

export type MagicFixSetPocketClusterStitchLineOffsetChangeRequest = HasStitchLineReferenceSchema & {
  type: 'set-pocket-cluster-stitch-line-offset'
  offsetField: keyof PocketClusterStitchLineOffsetsSchema
  value: number
}

export type MagicFixSetPocketClusterStitchLineDirectionChangeRequest = HasStitchLineReferenceSchema & {
  type: 'set-pocket-cluster-stitch-line-direction'
  value: StitchDirectionSchema
}

export type MagicFixChangeRequest =
  | MagicFixSetComponentDimensionChangeRequest
  | MagicFixSetLayoutGapChangeRequest
  | MagicFixSetComponentCornerRadiusChangeRequest
  | MagicFixSetPocketStepChangeRequest
  | MagicFixSetComponentBoundsStitchLineOffsetChangeRequest
  | MagicFixSetComponentBoundsStitchLineHorizontalDirectionChangeRequest
  | MagicFixSetComponentBoundsStitchLineVerticalDirectionChangeRequest
  | MagicFixSetPocketClusterStitchLineOffsetChangeRequest
  | MagicFixSetPocketClusterStitchLineDirectionChangeRequest
