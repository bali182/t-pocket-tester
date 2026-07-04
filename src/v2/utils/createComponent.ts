import { LEATHER_BASE_COLOR } from '../constants/drawing'
import { ComponentSchema, PanelSchema, PocketClusterSchema, PocketSchema, RootPanelSchema } from '../schemas/components'
import { getComponentColor } from './getComponentColor'
import { getUnusedComponentName } from './getUnusedComponentName'
import { id } from './id'

type ComponentByType = {
  'root-panel': RootPanelSchema
  panel: PanelSchema
  pocket: PocketSchema
  'pocket-cluster': PocketClusterSchema
}

export const createComponent = <T extends keyof ComponentByType>(
  type: T,
  components: Record<string, ComponentSchema>,
  nestingLevel = 0,
): ComponentByType[T] => ({
  ...DEFAULT_COMPONENT_BY_TYPE[type],
  color: getComponentColor(LEATHER_BASE_COLOR, nestingLevel),
  id: id(),
  name: getUnusedComponentName(type, components),
})

const DEFAULT_ROOT_PANEL: RootPanelSchema = {
  type: 'root-panel',
  id: '',
  name: '',
  color: LEATHER_BASE_COLOR,
  children: [],
  layout: {
    gap: 10,
    orientation: 'horizontal',
  },
  size: {
    width: 170,
    height: 100,
  },
}

const DEFAULT_PANEL: PanelSchema = {
  type: 'panel',
  id: '',
  name: '',
  color: LEATHER_BASE_COLOR,
  children: [],
  layout: {
    gap: 0,
    orientation: 'vertical',
  },
}

const DEFAULT_POCKET: PocketSchema = {
  type: 'pocket',
  id: '',
  name: '',
  color: LEATHER_BASE_COLOR,
}

const DEFAULT_POCKET_CLUSTER: PocketClusterSchema = {
  type: 'pocket-cluster',
  id: '',
  name: '',
  color: LEATHER_BASE_COLOR,
  cardSize: {
    width: 85.6,
    height: 54,
  },
  pocketCount: 3,
  sideClearance: 4,
  bottomClearance: 4,
  pocketSpacing: 8,
  pocketHeight: 36,
  tPocketTabWidth: 8,
  tPocketTaper: 4,
}

const DEFAULT_COMPONENT_BY_TYPE: ComponentByType = {
  'root-panel': DEFAULT_ROOT_PANEL,
  panel: DEFAULT_PANEL,
  pocket: DEFAULT_POCKET,
  'pocket-cluster': DEFAULT_POCKET_CLUSTER,
}
