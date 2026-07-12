import { LEATHER_BASE_COLOR } from './constants/drawing'
import { HasCornerRadiusSchema, HasLayoutSchema, RootPanelSchema } from './schemas/components'
import { ProjectSchema } from './schemas/project'

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

export const defaultComponent: RootPanelSchema = {
  ...defaultHasCornerRadius,
  ...defaultHasLayout,
  type: 'root-panel',
  id: 'root',
  name: 'Alap',
  color: LEATHER_BASE_COLOR,
  children: [],
  width: 170,
  height: 100,
}

export const defaultProject: ProjectSchema = {
  id: 'project 1',
  name: 'Új projekt',
  root: defaultComponent.id,
  components: {
    [defaultComponent.id]: defaultComponent,
  },
  editingSettings: {
    addComputedSizesToAutoSized: true,
    adjustCornerRadiiToParent: true,
  },
}
