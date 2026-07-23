import { HasIdentitySchema } from '../../../schemas/components'
import type {
  ComponentBoundsStitchLineOwnSchema,
  ComponentBoundsStitchLineSchema,
  PocketClusterStitchLineOwnSchema,
  PocketClusterStitchLineSchema,
  StitchLineComponentReferencesSchema,
} from '../../../schemas/stitching'

type StitchLineByTypeName = {
  'component-bounds-stitch-line': ComponentBoundsStitchLineSchema
  'pocket-cluster-stitch-line': PocketClusterStitchLineSchema
}

type CreateStitchLineParams<T> = {
  type: T
  id: string
  componentId: string
  name: string
}

export const createStitchLine = <T extends keyof StitchLineByTypeName>(
  params: CreateStitchLineParams<T>,
): StitchLineByTypeName[T] => {
  const defaults = DEFAULT_STITCH_LINES[params.type]
  return {
    ...defaults,
    id: params.id,
    type: params.type,
    componentId: params.componentId,
    name: params.name,
  }
}

const defaultStitchLine: ComponentBoundsStitchLineOwnSchema = {
  top: true,
  right: true,
  bottom: true,
  left: true,
  topLeftCorner: true,
  topRightCorner: true,
  bottomRightCorner: true,
  bottomLeftCorner: true,
  topStitchDirection: 'left-to-right',
  rightStitchDirection: 'top-to-bottom',
  bottomStitchDirection: 'right-to-left',
  leftStitchDirection: 'bottom-to-top',
  topStartOffset: 0,
  topEndOffset: 0,
  rightStartOffset: 0,
  rightEndOffset: 0,
  bottomStartOffset: 0,
  bottomEndOffset: 0,
  leftStartOffset: 0,
  leftEndOffset: 0,
}

const defaultPocketClusterStitchLine: PocketClusterStitchLineOwnSchema = {
  enabled: true,
  endOffset: 0,
  startOffset: 0,
  stitchDirection: 'start-to-end',
}

const junkIdentityProps: HasIdentitySchema & StitchLineComponentReferencesSchema = {
  componentId: '',
  id: '',
  name: '',
}

const DEFAULT_STITCH_LINES: StitchLineByTypeName = {
  'component-bounds-stitch-line': {
    ...defaultStitchLine,
    ...junkIdentityProps,
    type: 'component-bounds-stitch-line',
  },
  'pocket-cluster-stitch-line': {
    ...defaultPocketClusterStitchLine,
    ...junkIdentityProps,
    type: 'pocket-cluster-stitch-line',
  },
}
