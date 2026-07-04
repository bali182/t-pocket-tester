import { LEATHER_BASE_COLOR } from './constants/drawing'
import { RootPanelSchema } from './schemas/components'

export const defaultComponent: RootPanelSchema = {
  type: 'root-panel',
  id: 'root',
  name: 'Root panel',
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
