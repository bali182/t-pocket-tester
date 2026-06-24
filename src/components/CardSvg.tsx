import type { FC } from 'react'

import { CARD_RADIUS } from '../constants'
import type { Card } from '../types'

type CardSvgProps = {
  card: Card
  color: string
}

export const CardSvg: FC<CardSvgProps> = ({ card, color }) => {
  return (
    <rect
      x={card.outline.x}
      y={card.outline.y}
      width={card.outline.width}
      height={card.outline.height}
      rx={CARD_RADIUS}
      ry={CARD_RADIUS}
      fill={color}
    />
  )
}
