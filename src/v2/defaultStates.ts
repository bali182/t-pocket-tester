import { LEATHER_BASE_COLOR } from './constants/colors'
import { PanelSchema } from './schemas/components'

export const defaultComponent: PanelSchema = {
  type: 'panel',
  id: 'root',
  name: 'Main Panel',
  color: LEATHER_BASE_COLOR,
  children: [],
  layout: {
    gap: 10,
    orientation: 'horizontal',
  },
  size: {
    width: 17,
    height: 10,
  },
}
