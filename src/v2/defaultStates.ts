import { LEATHER_BASE_COLOR } from './constants/drawing'
import { RootPanelSchema } from './schemas/components'
import { ProjectSchema } from './schemas/project'

export const defaultComponent: RootPanelSchema = {
  type: 'root-panel',
  id: 'root',
  name: 'Alap',
  color: LEATHER_BASE_COLOR,
  children: [],
  layout: {
    orientation: 'horizontal',
    order: 'default',
    gap: 0,
  },
  size: {
    width: 170,
    height: 100,
  },
}

export const defaultProject: ProjectSchema = {
  id: 'project 1',
  name: 'Új projekt',
  root: defaultComponent.id,
  components: {
    [defaultComponent.id]: defaultComponent,
  },
}
