import BigNumber from 'bignumber.js'

import type { SubProjectSchema } from '../../../../../schemas/subProject'
import { isDefined } from '../../../../../utils/isDefined'
import type {
  AdaptiveMagicFixField,
  AdaptiveMagicFixFieldPath,
  AdaptiveMagicFixFieldValue,
  ComponentBoundsStitchLineFieldPath,
  PanelFieldPath,
  PocketClusterFieldPath,
  PocketClusterStitchLineFieldPath,
  RootPanelFieldPath,
} from '../types'

export const getFieldValue = (
  subProject: SubProjectSchema,
  field: AdaptiveMagicFixField,
): AdaptiveMagicFixFieldValue => {
  const value = getFieldValueByPath(subProject, field.path)

  switch (field.type) {
    case 'numeric':
      if (typeof value !== 'number') {
        throw new Error(`Expected a numeric value for field: ${JSON.stringify(field.path)}!`)
      }
      return new BigNumber(value)
    case 'boolean':
      if (typeof value !== 'boolean') {
        throw new Error(`Expected a boolean value for field: ${JSON.stringify(field.path)}!`)
      }
      return value
    case 'horizontal-direction':
      if (value !== 'left-to-right' && value !== 'right-to-left') {
        throw new Error(`Expected a horizontal stitch direction for field: ${JSON.stringify(field.path)}!`)
      }
      return value
    case 'vertical-direction':
      if (value !== 'top-to-bottom' && value !== 'bottom-to-top') {
        throw new Error(`Expected a vertical stitch direction for field: ${JSON.stringify(field.path)}!`)
      }
      return value
    case 'pocket-cluster-direction':
      if (value !== 'start-to-end' && value !== 'end-to-start') {
        throw new Error(`Expected a pocket cluster stitch direction for field: ${JSON.stringify(field.path)}!`)
      }
      return value
  }
}

const getFieldValueByPath = (subProject: SubProjectSchema, path: AdaptiveMagicFixFieldPath): unknown => {
  switch (path[0]) {
    case 'root-panel':
      return getRootPanelFieldValue(subProject, path)
    case 'panel':
      return getPanelFieldValue(subProject, path)
    case 'pocket-cluster':
      return getPocketClusterFieldValue(subProject, path)
    case 'component-bounds-stitch-line':
      return getComponentBoundsStitchLineFieldValue(subProject, path)
    case 'pocket-cluster-stitch-line':
      return getPocketClusterStitchLineFieldValue(subProject, path)
  }
}

const getRootPanelFieldValue = (subProject: SubProjectSchema, path: RootPanelFieldPath): unknown => {
  const component = subProject.components[path[1]]
  if (!isDefined(component)) {
    throw new Error(`Missing component: "${path[1]}"!`)
  }
  if (component.type !== 'root-panel') {
    throw new Error(`Invalid root panel type: "${path[1]}"!`)
  }

  return component[path[2]]
}

const getPanelFieldValue = (subProject: SubProjectSchema, path: PanelFieldPath): unknown => {
  const component = subProject.components[path[1]]
  if (!isDefined(component)) {
    throw new Error(`Missing component: "${path[1]}"!`)
  }
  if (component.type !== 'panel') {
    throw new Error(`Invalid panel type: "${path[1]}"!`)
  }

  return component[path[2]]
}

const getPocketClusterFieldValue = (subProject: SubProjectSchema, path: PocketClusterFieldPath): unknown => {
  const component = subProject.components[path[1]]
  if (!isDefined(component)) {
    throw new Error(`Missing component: "${path[1]}"!`)
  }
  if (component.type !== 'pocket-cluster') {
    throw new Error(`Invalid pocket cluster type: "${path[1]}"!`)
  }

  return component[path[2]]
}

const getComponentBoundsStitchLineFieldValue = (
  subProject: SubProjectSchema,
  path: ComponentBoundsStitchLineFieldPath,
): unknown => {
  const stitchLine = subProject.stitchLines.find((candidate) => candidate.id === path[1])
  if (!isDefined(stitchLine)) {
    throw new Error(`Missing stitch line: "${path[1]}"!`)
  }
  if (stitchLine.type !== 'component-bounds-stitch-line') {
    throw new Error(`Invalid component bounds stitch line type: "${path[1]}"!`)
  }

  return stitchLine[path[2]]
}

const getPocketClusterStitchLineFieldValue = (
  subProject: SubProjectSchema,
  path: PocketClusterStitchLineFieldPath,
): unknown => {
  const stitchLine = subProject.stitchLines.find((candidate) => candidate.id === path[1])
  if (!isDefined(stitchLine)) {
    throw new Error(`Missing stitch line: "${path[1]}"!`)
  }
  if (stitchLine.type !== 'pocket-cluster-stitch-line') {
    throw new Error(`Invalid pocket cluster stitch line type: "${path[1]}"!`)
  }

  return stitchLine[path[2]]
}
