import type BigNumber from 'bignumber.js'

import type { ComponentSchema } from '../../schemas/components'
import type { SubProjectSchema } from '../../schemas/subProject'

export type MagicStitchLineFixIssueReason =
  | 'incompatible-stitch-configurations'
  | 'conflicting-layout-constraints'
  | 'conflicting-stitch-geometry'
  | 'pocket-step-does-not-fit'

export type MagicStitchLineFixIssue = {
  componentId: string
  reason: MagicStitchLineFixIssueReason
}

export type MagicStitchLineFixResult = {
  subProject: SubProjectSchema
  issues: MagicStitchLineFixIssue[]
}

export type MagicSizeAxis = 'width' | 'height'

export type StitchOffsetKey =
  | 'topStartOffset'
  | 'topEndOffset'
  | 'rightStartOffset'
  | 'rightEndOffset'
  | 'bottomStartOffset'
  | 'bottomEndOffset'
  | 'leftStartOffset'
  | 'leftEndOffset'

export type ComponentSizeRequirement = {
  componentId: string
  axis: MagicSizeAxis
  targetSize: BigNumber
}

export type StitchGeometryEndpointRequirement = {
  key: StitchOffsetKey
  originalOffset: BigNumber
  normalizedOffset: BigNumber
  isFlexible: boolean
  maximumOffset: BigNumber
}

export type StitchGeometrySideRequirement = {
  componentId: string
  axis: MagicSizeAxis
  stitchLineId: string
  stitchMargin: BigNumber
  stitchHoleDistance: BigNumber
  start: StitchGeometryEndpointRequirement
  end: StitchGeometryEndpointRequirement
}

export type ComponentAxisStitchGeometryRequirement = {
  componentId: string
  axis: MagicSizeAxis
  currentSize: BigNumber
  sides: StitchGeometrySideRequirement[]
}

export type StitchOffsetRequirement = {
  componentId: string
  stitchLineId: string
  key: StitchOffsetKey
  value: number
}

export type PocketStepRequirement = {
  componentId: string
  value: number
  minimumStackSize: BigNumber
  stackAxis: MagicSizeAxis
}

export type StitchRequirementCollection = {
  sizeRequirements: ComponentSizeRequirement[]
  geometryRequirements: ComponentAxisStitchGeometryRequirement[]
  offsetRequirements: StitchOffsetRequirement[]
  pocketStepRequirements: PocketStepRequirement[]
  issues: MagicStitchLineFixIssue[]
  skippedComponentIds: Set<string>
}

export type MagicStitchLineFixPlan = {
  componentUpdates: Map<string, ComponentSchema>
  stitchLineUpdates: Map<string, Partial<Record<StitchOffsetKey, number>>>
  issues: MagicStitchLineFixIssue[]
}
