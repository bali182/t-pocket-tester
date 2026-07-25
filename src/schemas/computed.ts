import { PathSchema, RectSchema } from './geometry'
import { StitchHoleSchema } from './stitching'

type BaseComputedSchema = {
  componentId: string
  boundingRect: RectSchema
  path: PathSchema
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
  boundingRect: RectSchema
  path: PathSchema
}

export type ComputedTPocketSchema = {
  type: 'computed-t-pocket'
  id: string
  boundingRect: RectSchema
  path: PathSchema
}

export type ComputedPocketClusterSchema = BaseComputedSchema & {
  type: 'computed-pocket-cluster'
  frontPocket: ComputedTopPocketSchema
  tPockets: ComputedTPocketSchema[]
}

export type ComputedComponentSchema = ComputedRootPanelSchema | ComputedPanelSchema | ComputedPocketClusterSchema

export type ComputedStitchRouteSchema = {
  path: PathSchema
  holes: StitchHoleSchema[]
}

export type ComputedStitchLineSchema = {
  stitchLineId: string
  componentId: string
  routes: ComputedStitchRouteSchema[]
}
