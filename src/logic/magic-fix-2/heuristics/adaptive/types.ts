import type BigNumber from 'bignumber.js'
import { HasIdentitySchema } from '../../../../schemas/common'
import {
  HasChildrenSchema,
  HasColorSchema,
  PanelSchema,
  PocketClusterSchema,
  RootPanelSchema,
} from '../../../../schemas/components'
import { ComponentBoundsStitchLineOwnSchema, PocketClusterStitchLineOwnSchema } from '../../../../schemas/stitching'

// Fields
type RootPanelField = Exclude<
  keyof RootPanelSchema,
  'type' | keyof HasIdentitySchema | keyof HasColorSchema | keyof HasChildrenSchema
>
type PanelField = Exclude<
  keyof PanelSchema,
  'type' | keyof HasIdentitySchema | keyof HasColorSchema | keyof HasChildrenSchema
>
type PocketClusterField = Exclude<
  keyof PocketClusterSchema,
  'type' | keyof HasIdentitySchema | keyof HasColorSchema | keyof HasChildrenSchema | 'pocketCount' | 'cardId'
>

type ComponentBoundsStitchLineField = keyof ComponentBoundsStitchLineOwnSchema
type PocketClusterStitchLineField = keyof PocketClusterStitchLineOwnSchema

type StitchLineField = ComponentBoundsStitchLineField | PocketClusterStitchLineField
type ComponentField = RootPanelField | PanelField | PocketClusterField

export type AdaptiveMagicFixComponentFieldPath = readonly ['components', string, ComponentField]

export type AdaptiveMagicFixStitchLineFieldPath = readonly ['stitchLines', string, StitchLineField]

export type AdaptiveMagicFixFieldPath = AdaptiveMagicFixComponentFieldPath | AdaptiveMagicFixStitchLineFieldPath

export type AdaptiveMagicFixNumericField = {
  type: 'numeric'
  path: AdaptiveMagicFixFieldPath
  minValue: number
  maxValue: number
}

export type AdaptiveMagicFixBooleanField = {
  type: 'boolean'
  path: AdaptiveMagicFixFieldPath
  initialValue: boolean
}

export type AdaptiveMagicFixField = AdaptiveMagicFixNumericField | AdaptiveMagicFixBooleanField

export type AdaptiveMagicFixFieldValue = number | boolean

export type AdaptiveMagicFixDiscoveryConfiguration = {
  readonly values: readonly AdaptiveMagicFixFieldValue[]
}

export type AdaptiveMagicFixHeuristicsPlan = {
  readonly fields: readonly AdaptiveMagicFixField[]
  readonly discoveryConfigurations: readonly AdaptiveMagicFixDiscoveryConfiguration[]
}

export type AdaptiveMagicFixHeuristicsScore = {
  totalDeviation: BigNumber
  issueCount: number
}

export type AdaptiveMagicFixHeuristicsState = {
  bestValues: AdaptiveMagicFixFieldValue[]
  bestScore: AdaptiveMagicFixHeuristicsScore
  lastValues: AdaptiveMagicFixFieldValue[] | undefined
}
