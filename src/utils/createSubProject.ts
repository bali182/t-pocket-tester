import type { RootPanelSchema } from '../schemas/components'
import type { SubProjectSchema } from '../schemas/subProject'
import { id } from './id'

export const createSubProject = (rootName: string): SubProjectSchema => {
  const root: RootPanelSchema = {
    borderRadius: 0,
    topLeftRadius: 0,
    bottomLeftRadius: 0,
    bottomRightRadius: 0,
    topRightRadius: 0,
    individualRadii: false,
    layoutOrientation: 'horizontal',
    layoutOrder: 'default',
    layoutGap: 0,
    type: 'root-panel',
    id: id(),
    name: rootName,
    children: [],
    width: 170,
    height: 100,
  }

  return {
    id: id(),
    root: root.id,
    components: {
      [root.id]: root,
    },
    holes: [],
    stitchLines: [],
  }
}
