import type BigNumber from 'bignumber.js'

import { HasComponentReferenceSchema, HasId, HasTargetSchema, HasTypeSchema } from './common'
import { PathSchema, RectSchema } from './geometry'
import { StitchHoleSchema } from './stitching'
import { CardSchema } from './valuables'

type HasPathSchema = {
  path: PathSchema
}

type HasBoundingRectSchema = {
  boundingRect: RectSchema
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
  HasComputedLayoutGapSchema &
  HasComputedChildrenSchema

export type ComputedPanelSchema = HasTypeSchema<'computed-panel'> &
  BaseComputedSchema &
  HasUncutPathSchema &
  HasComputedLayoutGapSchema &
  HasComputedChildrenSchema

export type ComputedTopPocketSchema = HasTypeSchema<'computed-top-pocket'> &
  BaseComputedSchema &
  HasUncutPathSchema &
  HasId &
  HasComputedCardSchema

export type ComputedTPocketSchema = HasTypeSchema<'computed-t-pocket'> &
  BaseComputedSchema &
  HasUncutPathSchema &
  HasId &
  HasComputedCardSchema

export type ComputedCardSchema = HasTypeSchema<'computed-card'> &
  HasPathSchema &
  HasBoundingRectSchema & {
    card: CardSchema
  }

export type ComputedPocketClusterSchema = HasTypeSchema<'computed-pocket-cluster'> &
  BaseComputedSchema &
  HasUncutPathSchema & {
    frontPocket: ComputedTopPocketSchema
    tPockets: ComputedTPocketSchema[]
  }

export type ComputedComponentSchema = ComputedRootPanelSchema | ComputedPanelSchema | ComputedPocketClusterSchema

export type ComputedHoleSchema = BaseComputedSchema & {
  holeId: string
  highlightPath: PathSchema
}

export type ComputedStitchRouteSchema = {
  path: PathSchema
  holes: StitchHoleSchema[]
}

export type ComputedStitchLineSchema = HasTargetSchema & {
  stitchLineId: string
  componentId: string
  routes: ComputedStitchRouteSchema[]
}
