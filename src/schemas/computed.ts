import type BigNumber from 'bignumber.js'

import { HasComponentReferenceSchema, HasId, HasTargetSchema } from './common'
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

export type ComputedRootPanelSchema = BaseComputedSchema &
  HasUncutPathSchema &
  HasComputedLayoutGapSchema &
  HasComputedChildrenSchema & {
    type: 'computed-root-panel'
  }

export type ComputedPanelSchema = BaseComputedSchema &
  HasUncutPathSchema &
  HasComputedLayoutGapSchema &
  HasComputedChildrenSchema & {
    type: 'computed-panel'
  }

export type ComputedTopPocketSchema = BaseComputedSchema &
  HasUncutPathSchema &
  HasId &
  HasComputedCardSchema & {
    type: 'computed-top-pocket'
  }

export type ComputedTPocketSchema = BaseComputedSchema &
  HasUncutPathSchema &
  HasId &
  HasComputedCardSchema & {
    type: 'computed-t-pocket'
  }

export type ComputedCardSchema = HasPathSchema &
  HasBoundingRectSchema & {
    type: 'computed-card'
    card: CardSchema
  }

export type ComputedPocketClusterSchema = BaseComputedSchema &
  HasUncutPathSchema & {
    type: 'computed-pocket-cluster'
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
