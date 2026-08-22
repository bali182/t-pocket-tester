import { HasCornerRadiusSchema, HasSqueezeSchema } from '../../../schemas/common'
import {
  HasAutoDimensionsSchema,
  HasLayoutSchema,
  PanelSchema,
  PocketClusterSchema,
  RootPanelSchema,
} from '../../../schemas/components'
import { isDefined } from '../../../utils/isDefined'

type ComponentByType = {
  'root-panel': RootPanelSchema
  panel: PanelSchema
  'pocket-cluster': PocketClusterSchema
}

type CreateComponentParams<T extends keyof ComponentByType> = {
  type: T
  id: string
  color?: string
  name: string
}

export const createComponent = <T extends keyof ComponentByType>({
  type,
  color,
  id,
  name,
}: CreateComponentParams<T>): ComponentByType[T] => {
  const component: ComponentByType[T] = {
    ...DEFAULT_COMPONENT_BY_TYPE[type],
    id,
    name,
  }

  if (isDefined(color)) {
    component.color = color
  }

  return component
}

const defaultHasCornerRadius: HasCornerRadiusSchema = {
  topLeftRadius: 0,
  bottomLeftRadius: 0,
  bottomRightRadius: 0,
  topRightRadius: 0,
  individualRadii: false,
}

const defaultHasLayout: HasLayoutSchema = {
  layoutOrientation: 'horizontal',
  offAxisAnchor: 'middle',
  layoutGap: 0,
  autoLayoutGap: false,
}

const defaultHasFillableSize: HasAutoDimensionsSchema = {
  width: 10,
  height: 10,
  autoHeight: true,
  autoWidth: true,
}

const defaultHasSqueeze: HasSqueezeSchema = {
  topSqueeze: 0,
  rightSqueeze: 0,
  bottomSqueeze: 0,
  leftSqueeze: 0,
}

const DEFAULT_ROOT_PANEL: RootPanelSchema = {
  ...defaultHasLayout,
  ...defaultHasCornerRadius,
  type: 'root-panel',
  id: '',
  name: '',
  children: [],
  width: 170,
  height: 100,
}

const DEFAULT_PANEL: PanelSchema = {
  ...defaultHasLayout,
  ...defaultHasCornerRadius,
  ...defaultHasFillableSize,
  ...defaultHasSqueeze,
  type: 'panel',
  id: '',
  name: '',
  children: [],
}

const DEFAULT_POCKET_CLUSTER: PocketClusterSchema = {
  ...defaultHasCornerRadius,
  ...defaultHasFillableSize,
  ...defaultHasSqueeze,
  type: 'pocket-cluster',
  id: '',
  name: '',
  orientation: 'up',
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
