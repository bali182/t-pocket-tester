import type { BackPanelSchema } from '../schemas/BackPanelSchema'
import type { CardHolderInputSchema } from '../schemas/CardHolderInputSchema'
import { calculateOverallSize } from './utils'

export const calculateBackPanel = (input: CardHolderInputSchema): BackPanelSchema => {
  const overallSize = calculateOverallSize(input)

  return {
    kind: 'backPanel',
    outline: {
      x: 0,
      y: 0,
      width: overallSize.width,
      height: overallSize.height,
    },
  }
}
