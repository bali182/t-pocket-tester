import { createComponent } from '../operations/subProject/utils/createComponent'
import type { RootPanelSchema } from '../schemas/components'
import type { SubProjectSchema } from '../schemas/subProject'
import { id } from './id'

export const createSubProject = (rootName: string): SubProjectSchema => {
  const root: RootPanelSchema = createComponent({
    id: id(),
    name: rootName,
    type: 'root-panel',
  })
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
