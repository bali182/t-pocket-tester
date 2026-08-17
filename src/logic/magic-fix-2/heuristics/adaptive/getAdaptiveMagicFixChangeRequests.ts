import BigNumber from 'bignumber.js'

import type { MagicFixChangeRequest } from '../../../../schemas/magicFixChangeRequest'
import type {
  AdaptiveMagicFixField,
  AdaptiveMagicFixFieldValue,
  ComponentBoundsStitchLineFieldPath,
  PanelFieldPath,
  PocketClusterFieldPath,
  PocketClusterStitchLineFieldPath,
  RootPanelFieldPath,
} from './types'

export const getAdaptiveMagicFixChangeRequests = (
  fields: readonly AdaptiveMagicFixField[],
  values: readonly AdaptiveMagicFixFieldValue[],
): MagicFixChangeRequest[] => {
  if (fields.length !== values.length) {
    throw new Error('Adaptive Magic Fix fields and values must have equal lengths!')
  }

  return fields.map((field, index) => getAdaptiveMagicFixChangeRequest(field, values[index]))
}

const getAdaptiveMagicFixChangeRequest = (
  field: AdaptiveMagicFixField,
  value: AdaptiveMagicFixFieldValue | undefined,
): MagicFixChangeRequest => {
  switch (field.type) {
    case 'numeric':
      return getNumericChangeRequest(field.path, value)
    case 'boolean': {
      return getBooleanChangeRequest(field.path, value)
    }
    case 'horizontal-direction': {
      if (field.path[0] !== 'component-bounds-stitch-line') {
        throw new Error(`Invalid horizontal adaptive Magic Fix field: "${field.path.join('.')}"!`)
      }
      return getHorizontalDirectionChangeRequest(field.path, value)
    }
    case 'vertical-direction': {
      if (field.path[0] !== 'component-bounds-stitch-line') {
        throw new Error(`Invalid vertical adaptive Magic Fix field: "${field.path.join('.')}"!`)
      }
      return getVerticalDirectionChangeRequest(field.path, value)
    }
    case 'pocket-cluster-direction': {
      if (field.path[0] !== 'pocket-cluster-stitch-line') {
        throw new Error(`Invalid pocket cluster adaptive Magic Fix field: "${field.path.join('.')}"!`)
      }
      return getPocketClusterDirectionChangeRequest(field.path, value)
    }
  }
}

const getNumericChangeRequest = (
  path: AdaptiveMagicFixField['path'],
  value: AdaptiveMagicFixFieldValue | undefined,
): MagicFixChangeRequest => {
  if (!BigNumber.isBigNumber(value)) {
    throw new Error(`Expected numeric value for adaptive Magic Fix field: "${path.join('.')}"!`)
  }

  const numericValue = value.toNumber()
  switch (path[0]) {
    case 'root-panel':
    case 'panel':
    case 'pocket-cluster':
      return getNumericComponentChangeRequest(path, numericValue)
    case 'component-bounds-stitch-line':
      return getComponentBoundsOffsetChangeRequest(path, numericValue)
    case 'pocket-cluster-stitch-line':
      return getPocketClusterOffsetChangeRequest(path, numericValue)
  }
}

const getNumericComponentChangeRequest = (
  path: RootPanelFieldPath | PanelFieldPath | PocketClusterFieldPath,
  value: number,
): MagicFixChangeRequest => {
  switch (path[2]) {
    case 'width':
    case 'height':
      return { type: 'set-component-dimension', componentId: path[1], dimensionField: path[2], value }
    case 'layoutGap':
      return { type: 'set-layout-gap', componentId: path[1], value }
    case 'pocketStep':
      return { type: 'set-pocket-step', componentId: path[1], value }
    case 'borderRadius':
    case 'topLeftRadius':
    case 'topRightRadius':
    case 'bottomRightRadius':
    case 'bottomLeftRadius':
      return { type: 'set-component-corner-radius', componentId: path[1], radiusField: path[2], value }
    default:
      throw new Error(`Invalid numeric component field: "${path.join('.')}"!`)
  }
}

const getComponentBoundsOffsetChangeRequest = (
  path: ComponentBoundsStitchLineFieldPath,
  value: number,
): MagicFixChangeRequest => {
  switch (path[2]) {
    case 'topStartOffset':
    case 'topEndOffset':
    case 'rightStartOffset':
    case 'rightEndOffset':
    case 'bottomStartOffset':
    case 'bottomEndOffset':
    case 'leftStartOffset':
    case 'leftEndOffset':
      return { type: 'set-component-bounds-stitch-line-offset', stitchLineId: path[1], offsetField: path[2], value }
    default:
      throw new Error(`Invalid component bounds stitch line offset: "${path.join('.')}"!`)
  }
}

const getPocketClusterOffsetChangeRequest = (
  path: PocketClusterStitchLineFieldPath,
  value: number,
): MagicFixChangeRequest => {
  switch (path[2]) {
    case 'startOffset':
    case 'endOffset':
      return { type: 'set-pocket-cluster-stitch-line-offset', stitchLineId: path[1], offsetField: path[2], value }
    default:
      throw new Error(`Invalid pocket cluster stitch line offset: "${path.join('.')}"!`)
  }
}

const getBooleanChangeRequest = (
  path: AdaptiveMagicFixField['path'],
  value: AdaptiveMagicFixFieldValue | undefined,
): MagicFixChangeRequest => {
  if (typeof value !== 'boolean') {
    throw new Error(`Expected boolean value for adaptive Magic Fix field: "${path.join('.')}"!`)
  }
  if (path[0] === 'component-bounds-stitch-line' || path[0] === 'pocket-cluster-stitch-line') {
    throw new Error(`Invalid boolean adaptive Magic Fix field: "${path.join('.')}"!`)
  }

  switch (path[2]) {
    case 'autoWidth':
    case 'autoHeight':
      return { type: 'set-component-auto-dimension', componentId: path[1], autoDimensionField: path[2], value }
    case 'individualRadii':
      return { type: 'set-component-individual-radii', componentId: path[1], value }
    default:
      throw new Error(`Invalid boolean component field: "${path.join('.')}"!`)
  }
}

const getHorizontalDirectionChangeRequest = (
  path: ComponentBoundsStitchLineFieldPath,
  value: AdaptiveMagicFixFieldValue | undefined,
): MagicFixChangeRequest => {
  if (value !== 'left-to-right' && value !== 'right-to-left') {
    throw new Error(`Expected horizontal direction for adaptive Magic Fix field: "${path.join('.')}"!`)
  }
  if (path[2] !== 'topStitchDirection' && path[2] !== 'bottomStitchDirection') {
    throw new Error(`Invalid horizontal direction field: "${path.join('.')}"!`)
  }

  return {
    type: 'set-component-bounds-stitch-line-horizontal-direction',
    stitchLineId: path[1],
    directionField: path[2],
    value,
  }
}

const getVerticalDirectionChangeRequest = (
  path: ComponentBoundsStitchLineFieldPath,
  value: AdaptiveMagicFixFieldValue | undefined,
): MagicFixChangeRequest => {
  if (value !== 'top-to-bottom' && value !== 'bottom-to-top') {
    throw new Error(`Expected vertical direction for adaptive Magic Fix field: "${path.join('.')}"!`)
  }
  if (path[2] !== 'rightStitchDirection' && path[2] !== 'leftStitchDirection') {
    throw new Error(`Invalid vertical direction field: "${path.join('.')}"!`)
  }

  return {
    type: 'set-component-bounds-stitch-line-vertical-direction',
    stitchLineId: path[1],
    directionField: path[2],
    value,
  }
}

const getPocketClusterDirectionChangeRequest = (
  path: PocketClusterStitchLineFieldPath,
  value: AdaptiveMagicFixFieldValue | undefined,
): MagicFixChangeRequest => {
  if (value !== 'start-to-end' && value !== 'end-to-start') {
    throw new Error(`Expected pocket cluster direction for adaptive Magic Fix field: "${path.join('.')}"!`)
  }
  if (path[2] !== 'stitchDirection') {
    throw new Error(`Invalid pocket cluster direction field: "${path.join('.')}"!`)
  }

  return { type: 'set-pocket-cluster-stitch-line-direction', stitchLineId: path[1], value }
}
