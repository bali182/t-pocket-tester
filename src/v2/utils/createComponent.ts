import { LEATHER_BASE_COLOR } from '../constants/drawing'
import { LayoutSchema, PanelSchema, PocketClusterSchema, RootPanelSchema } from '../schemas/components'
import type { ProjectSchema } from '../schemas/project'
import { getComponentColor } from './getComponentColor'
import { getUnusedComponentName } from './getUnusedComponentName'
import { id } from './id'

type ComponentByType = {
  'root-panel': RootPanelSchema
  panel: PanelSchema
  'pocket-cluster': PocketClusterSchema
}

export const createComponent = <T extends keyof ComponentByType>(
  type: T,
  project: ProjectSchema,
  nestingLevel = 0,
): ComponentByType[T] => ({
  ...DEFAULT_COMPONENT_BY_TYPE[type],
  color: getComponentColor(LEATHER_BASE_COLOR, nestingLevel),
  id: id(),
  name: getUnusedComponentName(type, project),
})

const DEFAULT_LAYOUT: LayoutSchema = {
  gap: 0,
  orientation: 'horizontal',
  order: 'default',
}

const DEFAULT_ROOT_PANEL: RootPanelSchema = {
  type: 'root-panel',
  id: '',
  name: '',
  color: LEATHER_BASE_COLOR,
  children: [],
  layout: { ...DEFAULT_LAYOUT },
  size: {
    width: 170,
    height: 100,
  },
  radius: 0,
}

const DEFAULT_PANEL: PanelSchema = {
  type: 'panel',
  id: '',
  name: '',
  color: LEATHER_BASE_COLOR,
  children: [],
  radius: 0,
  layout: { ...DEFAULT_LAYOUT },
}

const DEFAULT_POCKET_CLUSTER: PocketClusterSchema = {
  type: 'pocket-cluster',
  id: '',
  name: '',
  orientation: 'up',
  color: LEATHER_BASE_COLOR,
  pocketCount: 3,
  pocketStep: 12,
  tPocketTabWidth: 8,
  tPocketTaper: 20,
  radius: 0,
  pocketRadius: 0,
}

const DEFAULT_COMPONENT_BY_TYPE: ComponentByType = {
  'root-panel': DEFAULT_ROOT_PANEL,
  panel: DEFAULT_PANEL,
  'pocket-cluster': DEFAULT_POCKET_CLUSTER,
}
