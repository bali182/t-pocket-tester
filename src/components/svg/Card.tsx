import type { FC } from 'react'

import { CARD_RADIUS } from '../../constants'
import type { CardModel } from '../../schemas/CardModelSchema'

type CardProps = {
  card: CardModel
  color: string
}

export const Card: FC<CardProps> = ({ card, color }) => {
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
