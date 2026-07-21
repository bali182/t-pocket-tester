import { IconType } from 'react-icons'
import { PiCardsThree, PiFrameCorners, PiRectangle } from 'react-icons/pi'
import { ComponentSchema } from '../schemas/components'

export const getComponentIcon = (type: ComponentSchema['type']): IconType => {
  switch (type) {
    case 'root-panel':
      return PiFrameCorners
    case 'panel':
      return PiRectangle
    case 'pocket-cluster':
      return PiCardsThree
  }
}
