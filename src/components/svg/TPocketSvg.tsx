import { useMemo, type FC } from 'react'

import { useAtomValue } from 'jotai'
import { STROKE_COLOR, STROKE_THICKNESS } from '../../constants'
import { calculateCardHolder } from '../../logic/calculateCardHolder'
import { calculateTPocketSize } from '../../logic/calculateTPocketSize'
import { calculateTPocketStitchLines } from '../../logic/calculateTPocketStitchLines'
import { transformTPocketToOrigin } from '../../logic/transformTPocketToOrigin'
import { getViewBox } from '../../logic/utils'
import { cardHolderInputAtom } from '../../state'
import { TPocket } from './TPocket'
import { TPocketStitchLines } from './TPocketStitchLines'

export const TPocketSvg: FC = () => {
  const input = useAtomValue(cardHolderInputAtom)
  const output = useMemo(() => calculateCardHolder(input), [input])
  const pocket = output.tPockets[0]
  const transformedPocket = pocket ? transformTPocketToOrigin(pocket) : undefined
  const stitchLines = transformedPocket ? calculateTPocketStitchLines(input, transformedPocket) : undefined
  const size = transformedPocket ? calculateTPocketSize(transformedPocket) : undefined

  if (!transformedPocket || !stitchLines || !size) {
    return null
  }

  return (
    <svg
      width={`${size.width}mm`}
      height={`${size.height}mm`}
      viewBox={getViewBox(STROKE_THICKNESS, { x: 0, y: 0, width: size.width, height: size.height })}
    >
      <TPocket pocket={transformedPocket} stroke={STROKE_COLOR} strokeWidth={STROKE_THICKNESS} />
      <TPocketStitchLines stitchLines={stitchLines} />
    </svg>
  )
}
