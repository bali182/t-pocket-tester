import { PathSchema, RectSchema } from './geometry'

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
