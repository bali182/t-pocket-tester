import { LEATHER_BASE_COLOR } from './constants/drawing'
import { RootPanelSchema } from './schemas/components'

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
