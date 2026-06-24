import { Box } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import type { FC } from 'react'
import { useMemo } from 'react'

import { BACK_PANEL_COLOR, POCKET_COLOR_LIGHTNESS_ADJUSTMENT, POCKET_OPACITY } from '../constants'
import { calculateCardHolder } from '../logic/calculateCardHolder'
import { adjustColorLightness, setOpacity } from '../logic/colorUtils'
import { cardHolderInputAtom } from '../state'
import { BackPanelSvg } from './BackPanelSvg'
import { PlainPocketSvg } from './PlainPocketSvg'
import { TPocketSvg } from './TPocketSvg'

export const DrawArea: FC = () => {
  const input = useAtomValue(cardHolderInputAtom)
  const cardHolder = useMemo(() => calculateCardHolder(input), [input])

  const getPocketFill = (layerIndex: number): string => {
    return setOpacity(
      adjustColorLightness(BACK_PANEL_COLOR, POCKET_COLOR_LIGHTNESS_ADJUSTMENT * layerIndex),
      POCKET_OPACITY,
    )
  }

  return (
    <Box height="100%" width="100%">
      <svg
        width={`${cardHolder.overallSize.width}mm`}
        height={`${cardHolder.overallSize.height}mm`}
        viewBox={`0 0 ${cardHolder.overallSize.width} ${cardHolder.overallSize.height}`}
      >
        <BackPanelSvg backPanel={cardHolder.backPanel} />

        {cardHolder.tPockets.map((pocket) => (
          <TPocketSvg key={pocket.index} pocket={pocket} fill={getPocketFill(pocket.index + 1)} />
        ))}

        <PlainPocketSvg pocket={cardHolder.coverPocket} fill={getPocketFill(cardHolder.tPockets.length + 1)} />
      </svg>
    </Box>
  )
}
