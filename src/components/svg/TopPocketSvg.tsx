import { useMemo, type FC } from 'react'

import { useAtomValue } from 'jotai'
import { STROKE_COLOR, STROKE_THICKNESS } from '../../constants'
import { calculateCardHolder } from '../../logic/calculateCardHolder'
import { calculateTopPocketStitchLines } from '../../logic/calculateTopPocketStitchLines'
import { transformTopPocketToOrigin } from '../../logic/transformTopPocketToOrigin'
import { getViewBox } from '../../logic/utils'
import { cardHolderInputAtom } from '../../state'
import { TopPocket } from './TopPocket'
import { TopPocketStitchLines } from './TopPocketStitchLines'

export const TopPocketSvg: FC = () => {
  const input = useAtomValue(cardHolderInputAtom)
  const output = useMemo(() => calculateCardHolder(input), [input])
  const pocket = transformTopPocketToOrigin(output.coverPocket)
  const stitchLines = calculateTopPocketStitchLines(input, pocket)

  return (
    <svg
      width={`${pocket.outline.width}mm`}
      height={`${pocket.outline.height}mm`}
      viewBox={getViewBox(STROKE_THICKNESS, pocket.outline)}
    >
      <TopPocket pocket={pocket} stroke={STROKE_COLOR} strokeWidth={STROKE_THICKNESS} />
      <TopPocketStitchLines stitchLines={stitchLines} />
    </svg>
  )
}
