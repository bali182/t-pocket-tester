import type { HasCornerRadiusValuesSchema, HasSizeSchema } from './common'
import type {
  ComponentBoundsStitchLineHorizontalDirectionsSchema,
  ComponentBoundsStitchLineOffsetsSchema,
  ComponentBoundsStitchLineVerticalDirectionsSchema,
  HorizontalStitchDirectionSchema,
  PocketClusterStitchLineOffsetsSchema,
  StitchDirectionSchema,
  VerticalStitchDirectionSchema,
} from './stitching'

export type MagicFixSetComponentDimensionChangeRequest = {
  type: 'set-component-dimension'
  componentId: string
  dimensionField: keyof HasSizeSchema
  value: number
}

export type MagicFixSetLayoutGapChangeRequest = {
  type: 'set-layout-gap'
  componentId: string
  value: number
}

export type MagicFixSetComponentCornerRadiusChangeRequest = {
  type: 'set-component-corner-radius'
  componentId: string
  radiusField: keyof HasCornerRadiusValuesSchema
  value: number
}

export type MagicFixSetPocketStepChangeRequest = {
  type: 'set-pocket-step'
  componentId: string
  value: number
}

export type MagicFixSetComponentBoundsStitchLineOffsetChangeRequest = {
  type: 'set-component-bounds-stitch-line-offset'
  stitchLineId: string
  offsetField: keyof ComponentBoundsStitchLineOffsetsSchema
  value: number
}

export type MagicFixSetComponentBoundsStitchLineHorizontalDirectionChangeRequest = {
  type: 'set-component-bounds-stitch-line-horizontal-direction'
  stitchLineId: string
  directionField: keyof ComponentBoundsStitchLineHorizontalDirectionsSchema
  value: HorizontalStitchDirectionSchema
}

export type MagicFixSetComponentBoundsStitchLineVerticalDirectionChangeRequest = {
  type: 'set-component-bounds-stitch-line-vertical-direction'
  stitchLineId: string
  directionField: keyof ComponentBoundsStitchLineVerticalDirectionsSchema
  value: VerticalStitchDirectionSchema
}

export type MagicFixSetPocketClusterStitchLineOffsetChangeRequest = {
  type: 'set-pocket-cluster-stitch-line-offset'
  stitchLineId: string
  offsetField: keyof PocketClusterStitchLineOffsetsSchema
  value: number
}

export type MagicFixSetPocketClusterStitchLineDirectionChangeRequest = {
  type: 'set-pocket-cluster-stitch-line-direction'
  stitchLineId: string
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
