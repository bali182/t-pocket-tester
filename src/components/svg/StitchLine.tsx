import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import type { ComputedStitchLineSchema } from '../../schemas/computed'
import type { ResolvedStitchLineSchema } from '../../schemas/stitching'
import { StitchLineRoute } from './StitchLineRoute'
import { Stitches } from './Stitches'

type StitchLineProps = {
  computedStitchLine: ComputedStitchLineSchema
  stitchLine: ResolvedStitchLineSchema
}

export const StitchLine: FC<StitchLineProps> = ({ computedStitchLine, stitchLine }) => {
  const { isInteractive } = useDrawAreaContext()

  return (
    <g>
      {computedStitchLine.routes.map((route, index) => (
        <StitchLineRoute key={index} route={route} stitchLine={stitchLine} />
      ))}
      {isInteractive && stitchLine.stitchesVisible && (
        <Stitches stitches={computedStitchLine.connectingStitches} stitchLine={stitchLine} />
      )}
    </g>
  )
}
