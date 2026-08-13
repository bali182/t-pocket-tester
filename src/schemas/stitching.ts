import { HasComponentTargetSchema, HasIdentitySchema, HasTargetSchema } from './common'
import { PointSchema } from './geometry'

export type StitchDirectionSchema = 'start-to-end' | 'end-to-start'
export type HorizontalStitchDirectionSchema = 'left-to-right' | 'right-to-left'
export type VerticalStitchDirectionSchema = 'top-to-bottom' | 'bottom-to-top'
export type StitchSideSchema = 'top' | 'right' | 'bottom' | 'left'
export type StitchCornerSchema = 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left'

export type StitchHoleSchema = {
  center: PointSchema
  rotation: number
}

export type StitchLineCommonConfigSchema = {
  stitchMargin: number
  stitchHoleLength: number
  stitchHoleDistance: number
  stitchHoleThickness: number
  stitchLineThickness: number
  stitchHoleColor: string
  stitchLineColor: string
}

export type ComponentBoundsStitchLineOffsetsSchema = {
  // Offsets of the sides we stitch. What are these used for?
  // For example when stitching the side of a panel to another (forming a pocket)
  // we can start stitching in between the top of the back panel and the front one, forming a stronger stitch.
  topStartOffset: number
  topEndOffset: number

  rightStartOffset: number
  rightEndOffset: number

  bottomStartOffset: number
  bottomEndOffset: number

  leftStartOffset: number
  leftEndOffset: number
}

export type ComponentBoundsStitchLineHorizontalDirectionsSchema = {
  // Stitching direction for sides. Can only be changed if the sides are not connected by a corner.
  topStitchDirection: HorizontalStitchDirectionSchema
  bottomStitchDirection: HorizontalStitchDirectionSchema
}

export type ComponentBoundsStitchLineVerticalDirectionsSchema = {
  // Stitching direction for sides. Can only be changed if the sides are not connected by a corner.
  rightStitchDirection: VerticalStitchDirectionSchema
  leftStitchDirection: VerticalStitchDirectionSchema
}

export type ComponentBoundsStitchLineOwnSchema = ComponentBoundsStitchLineOffsetsSchema &
  ComponentBoundsStitchLineVerticalDirectionsSchema &
  ComponentBoundsStitchLineHorizontalDirectionsSchema & {
    // Are we stitching the given side?
    top: boolean
    right: boolean
    bottom: boolean
    left: boolean

    // Are we stitching the given corner (which may or may not have a radius)?
    topLeftCorner: boolean
    topRightCorner: boolean
    bottomRightCorner: boolean
    bottomLeftCorner: boolean
  }

type ComponentBoundsStitchLineDiscriminatorSchema = {
  type: 'component-bounds-stitch-line'
}

export type ComponentBoundsStitchLineSchema = HasIdentitySchema &
  HasTargetSchema &
  Partial<StitchLineCommonConfigSchema> &
  ComponentBoundsStitchLineOwnSchema &
  ComponentBoundsStitchLineDiscriminatorSchema

export type PocketClusterStitchLineOffsetsSchema = {
  startOffset: number
  endOffset: number
}

export type PocketClusterStitchLineOwnSchema = PocketClusterStitchLineOffsetsSchema & {
  enabled: boolean
  stitchDirection: StitchDirectionSchema
}

type PocketClusterStitchLineDiscriminatorSchema = {
  type: 'pocket-cluster-stitch-line'
}

export type PocketClusterStitchLineSchema = HasIdentitySchema &
  HasComponentTargetSchema &
  Partial<StitchLineCommonConfigSchema> &
  PocketClusterStitchLineOwnSchema &
  PocketClusterStitchLineDiscriminatorSchema

export type StitchLineSchema = ComponentBoundsStitchLineSchema | PocketClusterStitchLineSchema

export type ResolvedComponentBoundsStitchLineSchema = HasIdentitySchema &
  HasTargetSchema &
  StitchLineCommonConfigSchema &
  ComponentBoundsStitchLineOwnSchema &
  ComponentBoundsStitchLineDiscriminatorSchema

export type ResolvedPocketClusterStitchLineSchema = HasIdentitySchema &
  HasComponentTargetSchema &
  StitchLineCommonConfigSchema &
  PocketClusterStitchLineOwnSchema &
  PocketClusterStitchLineDiscriminatorSchema

export type ResolvedStitchLineSchema = ResolvedComponentBoundsStitchLineSchema | ResolvedPocketClusterStitchLineSchema
