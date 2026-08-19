import { HasSizeSchema } from '../common'
import { HasLayoutSchema, PanelSchema, PocketClusterSchema, RootPanelSchema } from '../components'
import {
  ComponentBoundsStitchLineHorizontalDirectionsSchema,
  ComponentBoundsStitchLineOffsetsSchema,
  ComponentBoundsStitchLineSchema,
  ComponentBoundsStitchLineVerticalDirectionsSchema,
  PocketClusterStitchLineOffsetsSchema,
  PocketClusterStitchLineOwnSchema,
  PocketClusterStitchLineSchema,
} from '../stitching'

export type MagicFixRootPanelFieldSchema = keyof HasSizeSchema | keyof Pick<HasLayoutSchema, 'layoutGap'>

export type MagicFixPanelFieldSchema = keyof HasSizeSchema | keyof Pick<HasLayoutSchema, 'layoutGap'>

export type MagicFixPocketClusterFieldSchema = keyof HasSizeSchema | keyof Pick<PocketClusterSchema, 'pocketStep'>

export type MagicFixComponentBoundsStitchLineFieldSchema =
  | keyof ComponentBoundsStitchLineOffsetsSchema
  | keyof ComponentBoundsStitchLineHorizontalDirectionsSchema
  | keyof ComponentBoundsStitchLineVerticalDirectionsSchema

export type MagicFixPocketClusterStitchLineFieldSchema =
  | keyof PocketClusterStitchLineOffsetsSchema
  | keyof Pick<PocketClusterStitchLineOwnSchema, 'stitchDirection'>

// Path representation of components/stitchlines
export type MagixFixRootPanelFieldPathSchema = readonly [RootPanelSchema['type'], string, MagicFixRootPanelFieldSchema]
export type MagicFixPanelFieldPathSchema = readonly [PanelSchema['type'], string, MagicFixPanelFieldSchema]
export type MagicFixPocketClusterFieldPathSchema = readonly [
  PocketClusterSchema['type'],
  string,
  MagicFixPocketClusterFieldSchema,
]
export type MagicFixComponentBoundsStitchLineFieldPathSchema = readonly [
  ComponentBoundsStitchLineSchema['type'],
  string,
  MagicFixComponentBoundsStitchLineFieldSchema,
]
export type MagicFixPocketClusterStitchLineFieldPathSchema = readonly [
  PocketClusterStitchLineSchema['type'],
  string,
  MagicFixPocketClusterStitchLineFieldSchema,
]

export type MagicFixPathSchema =
  | MagixFixRootPanelFieldPathSchema
  | MagicFixPanelFieldPathSchema
  | MagicFixPocketClusterFieldPathSchema
  | MagicFixComponentBoundsStitchLineFieldPathSchema
  | MagicFixPocketClusterStitchLineFieldPathSchema

export type MagicFixChangeRequestSchema = {
  path: MagicFixPathSchema
  value: unknown
}
