import { useCallback, useMemo, type FC } from 'react'

import { useAtomValue } from 'jotai'
import {
  LEATHER_BASE_COLOR,
  CARD_COLOR,
  CARD_OPACITY,
  POCKET_COLOR_LIGHTNESS_ADJUSTMENT,
  POCKET_OPACITY,
} from '../../constants'
import { calculateCardHolder } from '../../logic/calculateCardHolder'
import { adjustColorLightness, setOpacity } from '../../logic/colorUtils'
import { cardHolderInputAtom } from '../../state'
import { BackPanel } from './BackPanel'
import { Card } from './Card'
import { PlainPocket } from './PlainPocket'
import { TPocket } from './TPocket'

export const CardHolderSvg: FC = () => {
  const input = useAtomValue(cardHolderInputAtom)
  const output = useMemo(() => calculateCardHolder(input), [input])

  const getPocketColor = useCallback((index: number): string => {
    return setOpacity(
      adjustColorLightness(LEATHER_BASE_COLOR, POCKET_COLOR_LIGHTNESS_ADJUSTMENT * (index + 1)),
      POCKET_OPACITY,
    )
  }, [])

  const getCardColor = useCallback((_index: number): string => {
    return setOpacity(CARD_COLOR, CARD_OPACITY)
  }, [])

  return (
    <svg
      width={`${output.overallSize.width}mm`}
      height={`${output.overallSize.height}mm`}
      viewBox={`0 0 ${output.overallSize.width} ${output.overallSize.height}`}
    >
      <g>
        <BackPanel backPanel={output.backPanel} />

        {output.tPockets.map((pocket, index) => (
          <g key={pocket.index}>
            <Card card={output.cards[index]} color={getCardColor(index)} />
            <TPocket pocket={pocket} fill={getPocketColor(index)} />
          </g>
        ))}

        <Card card={output.cards[output.cards.length - 1]} color={getCardColor(output.cards.length - 1)} />
        <PlainPocket pocket={output.coverPocket} fill={getPocketColor(output.tPockets.length)} />
      </g>
    </svg>
  )
}
