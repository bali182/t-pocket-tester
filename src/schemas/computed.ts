import { HasTargetSchema } from './common'
import { PathSchema, RectSchema } from './geometry'
import { StitchHoleSchema } from './stitching'
import { CardSchema } from './valuables'

type BaseComputedSchema = {
  componentId: string
  boundingRect: RectSchema
  path: PathSchema
  uncutPath: PathSchema
}

export type ComputedRootPanelSchema = BaseComputedSchema & {
  type: 'computed-root-panel'
  children: ComputedComponentSchema[]
}

export type ComputedPanelSchema = BaseComputedSchema & {
  type: 'computed-panel'
  children: ComputedComponentSchema[]
}

export type ComputedTopPocketSchema = {
  type: 'computed-top-pocket'
  id: string
  ownerComponentId: string
  boundingRect: RectSchema
  path: PathSchema
  uncutPath: PathSchema
  card?: ComputedCardSchema
}

export type ComputedTPocketSchema = {
  type: 'computed-t-pocket'
  id: string
  ownerComponentId: string
  boundingRect: RectSchema
  path: PathSchema
  uncutPath: PathSchema
  card?: ComputedCardSchema
}

export type ComputedCardSchema = {
  type: 'computed-card'
  card: CardSchema
  boundingRect: RectSchema
  path: PathSchema
}

export type ComputedPocketClusterSchema = BaseComputedSchema & {
  type: 'computed-pocket-cluster'
  frontPocket: ComputedTopPocketSchema
  tPockets: ComputedTPocketSchema[]
}

export type ComputedComponentSchema = ComputedRootPanelSchema | ComputedPanelSchema | ComputedPocketClusterSchema

export type ComputedHoleSchema = {
  holeId: string
  componentId: string
  boundingRect: RectSchema
  path: PathSchema
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
