import {
  HasAutoCornerRadiusSchema,
  HasComponentTargetSchema,
  HasCornerRadiusSchema,
  HasIdentitySchema,
  HasTargetSchema,
  HasTypeSchema,
} from './common'
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
}

export type HasDirectionalOffsetsSchema = {
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

export type HasHorizontalDirectionsSchema = {
  // Stitching direction for sides. Can only be changed if the sides are not connected by a corner.
  topStitchDirection: HorizontalStitchDirectionSchema
  bottomStitchDirection: HorizontalStitchDirectionSchema
}

export type HasVerticalDirectionsSchema = {
  // Stitching direction for sides. Can only be changed if the sides are not connected by a corner.
  rightStitchDirection: VerticalStitchDirectionSchema
  leftStitchDirection: VerticalStitchDirectionSchema
}

export type ComponentBoundsStitchLineOwnSchema = HasDirectionalOffsetsSchema &
  HasAutoCornerRadiusSchema &
  HasCornerRadiusSchema &
  HasVerticalDirectionsSchema &
  HasHorizontalDirectionsSchema & {
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

export type ComponentBoundsStitchLineSchema = HasTypeSchema<'component-bounds-stitch-line'> &
  HasIdentitySchema &
  HasTargetSchema &
  Partial<StitchLineCommonConfigSchema> &
  ComponentBoundsStitchLineOwnSchema

export type HasBasicOffsetsSchema = {
  startOffset: number
  endOffset: number
}

export type PocketClusterStitchLineOwnSchema = HasBasicOffsetsSchema & {
  stitchDirection: StitchDirectionSchema
}

export type PocketClusterStitchLineSchema = HasTypeSchema<'pocket-cluster-stitch-line'> &
  HasIdentitySchema &
  HasComponentTargetSchema &
  Partial<StitchLineCommonConfigSchema> &
  PocketClusterStitchLineOwnSchema

export type StitchLineSchema = ComponentBoundsStitchLineSchema | PocketClusterStitchLineSchema

export type ResolvedComponentBoundsStitchLineSchema = HasIdentitySchema &
  HasTargetSchema &
  StitchLineCommonConfigSchema &
  ComponentBoundsStitchLineOwnSchema &
  HasTypeSchema<'component-bounds-stitch-line'>

export type ResolvedPocketClusterStitchLineSchema = HasTypeSchema<'pocket-cluster-stitch-line'> &
  HasIdentitySchema &
  HasComponentTargetSchema &
  StitchLineCommonConfigSchema &
  PocketClusterStitchLineOwnSchema

export type ResolvedStitchLineSchema = ResolvedComponentBoundsStitchLineSchema | ResolvedPocketClusterStitchLineSchema
