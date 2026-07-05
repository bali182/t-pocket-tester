import { PolygonSchema } from '../../v1/schemas/PolygonSchema'
import { PanelSchema, PocketClusterSchema, RootPanelSchema } from './components'
import { RectSchema } from './geometry'

type BaseComputedSchema = {
  schemaId: string
  boundingRect: RectSchema
}

export type ComputedRootPanelSchema = BaseComputedSchema & {
  type: RootPanelSchema['type']
}

export type ComputedPanelSchema = BaseComputedSchema & {
  type: PanelSchema['type']
}

export type ComputedPocketClusterSchema = BaseComputedSchema & {
  type: PocketClusterSchema['type']
  frontPocket: RectSchema
  tPockets: PolygonSchema
}
