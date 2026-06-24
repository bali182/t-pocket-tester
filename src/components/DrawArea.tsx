import { Box } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import type { FC } from 'react'
import { useCallback, useMemo } from 'react'

import { BACK_PANEL_COLOR, CARD_COLOR, CARD_OPACITY, POCKET_COLOR_LIGHTNESS_ADJUSTMENT, POCKET_OPACITY } from '../constants'
import { calculateCardHolder } from '../logic/calculateCardHolder'
import { adjustColorLightness, setOpacity } from '../logic/colorUtils'
import { cardHolderInputAtom } from '../state'
import { CardHolder } from './CardHolder'

export const DrawArea: FC = () => {
  const input = useAtomValue(cardHolderInputAtom)
  const cardHolder = useMemo(() => calculateCardHolder(input), [input])

  const getPocketColor = useCallback((index: number): string => {
    return setOpacity(
      adjustColorLightness(BACK_PANEL_COLOR, POCKET_COLOR_LIGHTNESS_ADJUSTMENT * (index + 1)),
      POCKET_OPACITY,
    )
  }, [])

  const getCardColor = useCallback((_index: number): string => {
    return setOpacity(CARD_COLOR, CARD_OPACITY)
  }, [])

  return (
    <Box height="100%" width="100%">
      <svg
        width={`${cardHolder.overallSize.width}mm`}
        height={`${cardHolder.overallSize.height}mm`}
        viewBox={`0 0 ${cardHolder.overallSize.width} ${cardHolder.overallSize.height}`}
      >
        <CardHolder
          input={input}
          output={cardHolder}
          getPocketColor={getPocketColor}
          getCardColor={getCardColor}
        />
      </svg>
    </Box>
  )
}
