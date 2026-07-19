import { LEATHER_BASE_COLOR } from '../constants/drawing'
import {
  HasCornerRadiusSchema,
  HasFillableSizeSchema,
  HasLayoutSchema,
  PanelSchema,
  PocketClusterSchema,
  RootPanelSchema,
} from '../schemas/components'
import type { ProjectSchema } from '../schemas/project'
import type { TranslationSchema } from '../translations/translation'
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
  t: TranslationSchema,
  nestingLevel = 0,
): ComponentByType[T] => ({
  ...DEFAULT_COMPONENT_BY_TYPE[type],
  color: getComponentColor(LEATHER_BASE_COLOR, nestingLevel),
  id: id(),
  name: getUnusedComponentName(type, project, t),
})

const defaultHasCornerRadius: HasCornerRadiusSchema = {
  borderRadius: 0,
  topLeftRadius: 0,
  bottomLeftRadius: 0,
  bottomRightRadius: 0,
  topRightRadius: 0,
  individualRadii: false,
}

const defaultHasLayout: HasLayoutSchema = {
  layoutOrientation: 'horizontal',
  layoutOrder: 'default',
  layoutGap: 0,
}

const defaultHasFillableSize: HasFillableSizeSchema = {
  width: 10,
  height: 10,
  autoHeight: true,
  autoWidth: true,
}

const DEFAULT_ROOT_PANEL: RootPanelSchema = {
  ...defaultHasLayout,
  ...defaultHasCornerRadius,
  type: 'root-panel',
  id: '',
  name: '',
  color: LEATHER_BASE_COLOR,
  children: [],
  width: 170,
  height: 100,
}

const DEFAULT_PANEL: PanelSchema = {
  ...defaultHasLayout,
  ...defaultHasCornerRadius,
  ...defaultHasFillableSize,
  type: 'panel',
  id: '',
  name: '',
  color: LEATHER_BASE_COLOR,
  children: [],
}

const DEFAULT_POCKET_CLUSTER: PocketClusterSchema = {
  ...defaultHasCornerRadius,
  ...defaultHasFillableSize,
  type: 'pocket-cluster',
  id: '',
  name: '',
  orientation: 'up',
  color: LEATHER_BASE_COLOR,
  pocketCount: 3,
  pocketStep: 12,
  tPocketTabWidth: 8,
  tPocketTaper: 20,
}

const DEFAULT_COMPONENT_BY_TYPE: ComponentByType = {
  'root-panel': DEFAULT_ROOT_PANEL,
  panel: DEFAULT_PANEL,
  'pocket-cluster': DEFAULT_POCKET_CLUSTER,
}
