import type { FC } from 'react'

import type { CalculatedCardHolder, CardHolderInput } from '../types'
import { BackPanelSvg } from './BackPanelSvg'
import { CardSvg } from './CardSvg'
import { PlainPocketSvg } from './PlainPocketSvg'
import { TPocketSvg } from './TPocketSvg'

type CardHolderProps = {
  input: CardHolderInput
  output: CalculatedCardHolder
  getPocketColor: (index: number) => string
  getCardColor: (index: number) => string
}

export const CardHolder: FC<CardHolderProps> = ({ getCardColor, getPocketColor, output }) => {
  return (
    <g>
      <BackPanelSvg backPanel={output.backPanel} />

      {output.tPockets.map((pocket, index) => (
        <g key={pocket.index}>
          <CardSvg card={output.cards[index]} color={getCardColor(index)} />
          <TPocketSvg pocket={pocket} fill={getPocketColor(index)} />
        </g>
      ))}

      <CardSvg card={output.cards[output.cards.length - 1]} color={getCardColor(output.cards.length - 1)} />
      <PlainPocketSvg pocket={output.coverPocket} fill={getPocketColor(output.tPockets.length)} />
    </g>
  )
}
