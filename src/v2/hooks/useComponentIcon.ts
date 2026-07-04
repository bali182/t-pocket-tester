import { IconType } from 'react-icons/lib'
import { PiCardsThree, PiFrameCorners, PiRectangle, PiTray } from 'react-icons/pi'
import { ComponentSchema } from '../schemas/components'

export const useComponentIcon = (component: ComponentSchema): IconType => {
  switch (component.type) {
    case 'root-panel':
      return PiFrameCorners
    case 'panel':
      return PiRectangle
    case 'pocket':
      return PiTray
    case 'pocket-cluster':
      return PiCardsThree
  }
}
