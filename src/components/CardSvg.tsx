import type { FC } from 'react'

import { CARD_COLOR, CARD_OPACITY, CARD_RADIUS } from '../constants'
import { setOpacity } from '../logic/colorUtils'
import type { Card } from '../types'

type Props = {
  card: Card
}

export const CardSvg: FC<Props> = ({ card }) => {
  return (
    <rect
      x={card.outline.x}
      y={card.outline.y}
      width={card.outline.width}
      height={card.outline.height}
      rx={CARD_RADIUS}
      ry={CARD_RADIUS}
      fill={setOpacity(CARD_COLOR, CARD_OPACITY)}
    />
  )
}
