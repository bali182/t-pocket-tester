import type BigNumber from 'bignumber.js'

import { HasComponentReferenceSchema, HasId, HasTargetSchema, HasTypeSchema } from './common'
import { CornerRadiusSchema, PathSchema, RectSchema } from './geometry'
import { StitchHoleSchema } from './stitching'
import { CardSchema } from './valuables'

type HasPathSchema = {
  path: PathSchema
}

type HasBoundingRectSchema = {
  boundingRect: RectSchema
}

type HasLayoutBoundingRectSchema = {
  layoutBoundingRect: RectSchema
}

type HasComputedCornerRadiusSchema = {
  cornerRadius: CornerRadiusSchema
}

type HasUncutPathSchema = {
  uncutPath: PathSchema
}

export type HasComputedChildrenSchema = {
  children: ComputedComponentSchema[]
}

export type HasComputedLayoutGapSchema = {
  computedLayoutGap: BigNumber
}

type HasComputedCardSchema = {
  card?: ComputedCardSchema
}

type BaseComputedSchema = HasComponentReferenceSchema & HasPathSchema & HasBoundingRectSchema

export type ComputedRootPanelSchema = HasTypeSchema<'computed-root-panel'> &
  BaseComputedSchema &
  HasUncutPathSchema &
  HasComputedCornerRadiusSchema &
  HasComputedLayoutGapSchema &
  HasComputedChildrenSchema

export type ComputedPanelSchema = HasTypeSchema<'computed-panel'> &
  BaseComputedSchema &
  HasLayoutBoundingRectSchema &
  HasUncutPathSchema &
  HasComputedCornerRadiusSchema &
  HasComputedLayoutGapSchema &
  HasComputedChildrenSchema

export type ComputedTopPocketSchema = HasTypeSchema<'computed-top-pocket'> &
  BaseComputedSchema &
  HasComputedCornerRadiusSchema &
  HasUncutPathSchema &
  HasId &
  HasComputedCardSchema

export type ComputedTPocketSchema = HasTypeSchema<'computed-t-pocket'> &
  BaseComputedSchema &
  HasComputedCornerRadiusSchema &
  HasUncutPathSchema &
  HasId &
  HasComputedCardSchema

export type ComputedCardSchema = HasTypeSchema<'computed-card'> &
  HasPathSchema &
  HasComputedCornerRadiusSchema &
  HasBoundingRectSchema & {
    card: CardSchema
  }

export type ComputedPocketClusterSchema = HasTypeSchema<'computed-pocket-cluster'> &
  BaseComputedSchema &
  HasLayoutBoundingRectSchema &
  HasUncutPathSchema &
  HasComputedCornerRadiusSchema & {
    frontPocket: ComputedTopPocketSchema
    tPockets: ComputedTPocketSchema[]
  }

export type ComputedComponentSchema = ComputedRootPanelSchema | ComputedPanelSchema | ComputedPocketClusterSchema

export type ComputedHoleSchema = BaseComputedSchema &
  HasComputedCornerRadiusSchema & {
    holeId: string
    highlightPath: PathSchema
  }

export type ComputedStitchRouteSchema = {
  path: PathSchema
  holes: StitchHoleSchema[]
  isClosed: boolean
}

export type ComputedStitchLineSchema = HasTargetSchema & {
  stitchLineId: string
  componentId: string
  autoComputedCornerRadius: CornerRadiusSchema
  routes: ComputedStitchRouteSchema[]
}
