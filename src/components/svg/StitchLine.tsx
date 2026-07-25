import type { FC } from 'react'

import type { ComputedStitchLineSchema } from '../../schemas/computed'
import type { StitchLineSchema } from '../../schemas/stitching'
import { StitchLineRoute } from './StitchLineRoute'

type StitchLineProps = {
  computedStitchLine: ComputedStitchLineSchema
  stitchHoleLength: number
  stitchLine: StitchLineSchema
}

export const StitchLine: FC<StitchLineProps> = ({ computedStitchLine, stitchHoleLength, stitchLine }) => {
  return (
    <g data-stitch-line-id={stitchLine.id} pointerEvents="none">
      {computedStitchLine.routes.map((route, index) => (
        <StitchLineRoute key={index} route={route} stitchHoleLength={stitchHoleLength} stitchLine={stitchLine} />
      ))}
    </g>
  )
}
