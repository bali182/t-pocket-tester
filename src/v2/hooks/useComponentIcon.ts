import { IconType } from 'react-icons/lib'
import { PiCardsThree, PiFrameCorners, PiRectangle } from 'react-icons/pi'
import { ComponentSchema } from '../schemas/components'

export const useComponentIcon = (type: ComponentSchema['type']): IconType => {
  switch (type) {
    case 'root-panel':
      return PiFrameCorners
    case 'panel':
      return PiRectangle
    case 'pocket-cluster':
      return PiCardsThree
  }
}
