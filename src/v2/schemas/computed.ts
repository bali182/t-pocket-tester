import { PolygonSchema } from '../../v1/schemas/PolygonSchema'
import { PanelSchema, PocketClusterSchema, RootPanelSchema } from './components'
import { RectSchema } from './geometry'

type BaseComputedSchema = {
  componentId: string
  boundingRect: RectSchema
}

export type ComputedRootPanelSchema = BaseComputedSchema & {
  type: RootPanelSchema['type']
  children: ComputedComponentSchema[]
}

export type ComputedPanelSchema = BaseComputedSchema & {
  type: PanelSchema['type']
  children: ComputedComponentSchema[]
}

export type ComputedPocketClusterSchema = BaseComputedSchema & {
  type: PocketClusterSchema['type']
  frontPocket: RectSchema
  tPockets: PolygonSchema[]
}

export type ComputedComponentSchema = ComputedRootPanelSchema | ComputedPanelSchema | ComputedPocketClusterSchema
