import { Path, RectSchema } from './geometry'

type BaseComputedSchema = {
  componentId: string
  boundingRect: RectSchema
  path: Path
}

export type ComputedRootPanelSchema = BaseComputedSchema & {
  type: 'computed-root-panel'
  children: ComputedComponentSchema[]
}

export type ComputedPanelSchema = BaseComputedSchema & {
  type: 'computed-panel'
  children: ComputedComponentSchema[]
}

export type ComputedTopPocket = {
  type: 'computed-top-pocket'
  id: string
  boundingRect: RectSchema
  path: Path
}

export type ComputedTPocket = {
  type: 'computed-t-pocket'
  id: string
  boundingRect: RectSchema
  path: Path
}

export type ComputedPocketClusterSchema = BaseComputedSchema & {
  type: 'computed-pocket-cluster'
  frontPocket: ComputedTopPocket
  tPockets: ComputedTPocket[]
}

export type ComputedComponentSchema = ComputedRootPanelSchema | ComputedPanelSchema | ComputedPocketClusterSchema
