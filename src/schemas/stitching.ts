import { HasIdentitySchema } from './components'
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

export type StitchLineComponentReferencesSchema = {
  /** Which component's bounding box are we stitching? */
  componentId: string
}

export type ComponentBoundsStitchLineOwnSchema = {
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

  // Stitching direction for sides. Can only be changed if the sides are not connected by a corner.
  topStitchDirection: HorizontalStitchDirectionSchema
  rightStitchDirection: VerticalStitchDirectionSchema
  bottomStitchDirection: HorizontalStitchDirectionSchema
  leftStitchDirection: VerticalStitchDirectionSchema

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

type ComponentBoundsStitchLineDiscriminatorSchema = {
  type: 'component-bounds-stitch-line'
}

export type ComponentBoundsStitchLineSchema = HasIdentitySchema &
  Partial<StitchLineCommonConfigSchema> &
  StitchLineComponentReferencesSchema &
  ComponentBoundsStitchLineOwnSchema &
  ComponentBoundsStitchLineDiscriminatorSchema

export type PocketClusterStitchLineOwnSchema = {
  enabled: boolean
  startOffset: number
  endOffset: number
  stitchDirection: StitchDirectionSchema
}

type PocketClusterStitchLineDiscriminatorSchema = {
  type: 'pocket-cluster-stitch-line'
}

export type PocketClusterStitchLineSchema = HasIdentitySchema &
  Partial<StitchLineCommonConfigSchema> &
  StitchLineComponentReferencesSchema &
  PocketClusterStitchLineOwnSchema &
  PocketClusterStitchLineDiscriminatorSchema

export type StitchLineSchema = ComponentBoundsStitchLineSchema | PocketClusterStitchLineSchema

export type ResolvedComponentBoundsStitchLineSchema = HasIdentitySchema &
  StitchLineCommonConfigSchema &
  StitchLineComponentReferencesSchema &
  ComponentBoundsStitchLineOwnSchema &
  ComponentBoundsStitchLineDiscriminatorSchema

export type ResolvedPocketClusterStitchLineSchema = HasIdentitySchema &
  StitchLineCommonConfigSchema &
  StitchLineComponentReferencesSchema &
  PocketClusterStitchLineOwnSchema &
  PocketClusterStitchLineDiscriminatorSchema

export type ResolvedStitchLineSchema = ResolvedComponentBoundsStitchLineSchema | ResolvedPocketClusterStitchLineSchema
