import type { BackPanelModel, CardHolderInput } from '../types'
import { calculateOverallSize } from './utils'

export const calculateBackPanel = (input: CardHolderInput): BackPanelModel => {
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
