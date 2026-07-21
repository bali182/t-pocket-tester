import { defaultStitchingSettings } from '../defaultStates'
import { ComponentSchema, HasIdentitySchema } from '../schemas/components'
import type { ProjectSchema } from '../schemas/project'
import type {
  ComponentBoundsStitchLineOwnSchema,
  ComponentBoundsStitchLineSchema,
  PocketClusterStitchLineOwnSchema,
  PocketClusterStitchLineSchema,
  StitchLineComponentReferencesSchema,
} from '../schemas/stitching'
import type { TranslationSchema } from '../translations/translationSchema'
import { getUnusedStitchLineName } from './getUnusedStitchLineName'
import { id } from './id'

type StitchLineByTypeName = {
  'component-bounds-stitch-line': ComponentBoundsStitchLineSchema
  'pocket-cluster-stitch-line': PocketClusterStitchLineSchema
}

export const createStitchLine = <T extends keyof StitchLineByTypeName>(
  type: T,
  project: ProjectSchema,
  component: ComponentSchema,
  t: TranslationSchema,
): StitchLineByTypeName[T] => {
  const defaults = DEFAULT_STITCH_LINES[type]
  return {
    ...defaults,
    ...project.stitchingSettings,
    id: id(),
    type,
    componentId: component.id,
    name: getUnusedStitchLineName(project, component, t),
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
    ...defaultStitchingSettings,
    ...defaultStitchLine,
    ...junkIdentityProps,
    type: 'component-bounds-stitch-line',
  },
  'pocket-cluster-stitch-line': {
    ...defaultStitchingSettings,
    ...defaultPocketClusterStitchLine,
    ...junkIdentityProps,
    type: 'pocket-cluster-stitch-line',
  },
}
