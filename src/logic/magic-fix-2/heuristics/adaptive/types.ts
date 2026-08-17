import type BigNumber from 'bignumber.js'
import { HasCornerRadiusSchema, HasSizeSchema } from '../../../../schemas/common'
import {
  HasFillableSizeSchema,
  HasLayoutSchema,
  type PanelSchema,
  type PocketClusterSchema,
  type RootPanelSchema,
} from '../../../../schemas/components'
import type {
  ComponentBoundsStitchLineHorizontalDirectionsSchema,
  ComponentBoundsStitchLineOffsetsSchema,
  ComponentBoundsStitchLineSchema,
  ComponentBoundsStitchLineVerticalDirectionsSchema,
  HorizontalStitchDirectionSchema,
  PocketClusterStitchLineOffsetsSchema,
  PocketClusterStitchLineOwnSchema,
  PocketClusterStitchLineSchema,
  StitchDirectionSchema,
  VerticalStitchDirectionSchema,
} from '../../../../schemas/stitching'

// Fields
type RootPanelField = keyof HasSizeSchema | keyof HasCornerRadiusSchema | keyof Pick<HasLayoutSchema, 'layoutGap'>

type PanelField = keyof HasFillableSizeSchema | keyof HasCornerRadiusSchema | keyof Pick<HasLayoutSchema, 'layoutGap'>

type PocketClusterField =
  | keyof HasFillableSizeSchema
  | keyof HasCornerRadiusSchema
  | keyof Pick<PocketClusterSchema, 'pocketStep'>

type ComponentBoundsStitchLineField =
  | keyof ComponentBoundsStitchLineOffsetsSchema
  | keyof ComponentBoundsStitchLineHorizontalDirectionsSchema
  | keyof ComponentBoundsStitchLineVerticalDirectionsSchema

type PocketClusterStitchLineField =
  | keyof PocketClusterStitchLineOffsetsSchema
  | keyof Pick<PocketClusterStitchLineOwnSchema, 'stitchDirection'>

// Path representation of components/stitchlines
export type RootPanelFieldPath = readonly [RootPanelSchema['type'], string, RootPanelField]
export type PanelFieldPath = readonly [PanelSchema['type'], string, PanelField]
export type PocketClusterFieldPath = readonly [PocketClusterSchema['type'], string, PocketClusterField]
export type ComponentBoundsStitchLineFieldPath = readonly [
  ComponentBoundsStitchLineSchema['type'],
  string,
  ComponentBoundsStitchLineField,
]
export type PocketClusterStitchLineFieldPath = readonly [
  PocketClusterStitchLineSchema['type'],
  string,
  PocketClusterStitchLineField,
]

export type AdaptiveMagicFixFieldPath =
  | RootPanelFieldPath
  | PanelFieldPath
  | PocketClusterFieldPath
  | ComponentBoundsStitchLineFieldPath
  | PocketClusterStitchLineFieldPath

export type AdaptiveMagicFixNumericBand = {
  readonly minValue: BigNumber
  readonly maxValue: BigNumber
}

export type AdaptiveMagicFixNumericField = {
  type: 'numeric'
  path: AdaptiveMagicFixFieldPath
  minValue: BigNumber
  maxValue: BigNumber
  bands: readonly AdaptiveMagicFixNumericBand[]
}

export type AdaptiveMagicFixBooleanField = {
  type: 'boolean'
  path: AdaptiveMagicFixFieldPath
  initialValue: boolean
}

export type AdaptiveMagicFixHorizontalDirectionField = {
  type: 'horizontal-direction'
  path: AdaptiveMagicFixFieldPath
  initialValue: HorizontalStitchDirectionSchema
  alternativeValue: HorizontalStitchDirectionSchema
}

export type AdaptiveMagicFixVerticalDirectionField = {
  type: 'vertical-direction'
  path: AdaptiveMagicFixFieldPath
  initialValue: VerticalStitchDirectionSchema
  alternativeValue: VerticalStitchDirectionSchema
}

export type AdaptiveMagicFixPocketClusterDirectionField = {
  type: 'pocket-cluster-direction'
  path: AdaptiveMagicFixFieldPath
  initialValue: StitchDirectionSchema
  alternativeValue: StitchDirectionSchema
}

export type AdaptiveMagicFixField =
  | AdaptiveMagicFixNumericField
  | AdaptiveMagicFixBooleanField
  | AdaptiveMagicFixHorizontalDirectionField
  | AdaptiveMagicFixVerticalDirectionField
  | AdaptiveMagicFixPocketClusterDirectionField

export type AdaptiveMagicFixFieldValue =
  | BigNumber
  | boolean
  | HorizontalStitchDirectionSchema
  | VerticalStitchDirectionSchema
  | StitchDirectionSchema

export type AdaptiveMagicFixConfiguration = {
  readonly values: readonly AdaptiveMagicFixFieldValue[]
}

export type AdaptiveMagicFixHeuristicsRound = {
  readonly fields: readonly AdaptiveMagicFixField[]
  readonly configurations: readonly AdaptiveMagicFixConfiguration[]
  readonly nextConfigurationIndex: number
  readonly bestValues: readonly AdaptiveMagicFixFieldValue[]
  readonly bestScore: AdaptiveMagicFixHeuristicsScore
  readonly sequenceIndex: number
}

export type AdaptiveMagicFixHeuristicsScore = {
  totalDeviation: BigNumber
  issueCount: number
}

export type AdaptiveMagicFixHeuristicsState = {
  readonly bestValues: readonly AdaptiveMagicFixFieldValue[]
  readonly bestScore: AdaptiveMagicFixHeuristicsScore
  readonly lastValues: readonly AdaptiveMagicFixFieldValue[] | undefined
  readonly currentRound: AdaptiveMagicFixHeuristicsRound
}
