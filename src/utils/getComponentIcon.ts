import { IconType } from 'react-icons'
import { PiCardsThree, PiRectangle, PiWallet } from 'react-icons/pi'
import { ComponentSchema } from '../schemas/components'

export const getComponentIcon = (type: ComponentSchema['type']): IconType => {
  switch (type) {
    case 'root-panel':
      // return PiFrameCorners
      return PiWallet
    case 'panel':
      return PiRectangle
    case 'pocket-cluster':
      return PiCardsThree
  }
}
