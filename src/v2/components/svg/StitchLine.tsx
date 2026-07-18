import type { FC } from 'react'

import type { ComputedStitchLineSchema } from '../../schemas/computed'
import type { ProjectStitchLineSchema } from '../../schemas/stitching'
import { StitchLineRoute } from './StitchLineRoute'

type StitchLineProps = {
  stitchLine: ProjectStitchLineSchema
  computedStitchLine: ComputedStitchLineSchema
}

export const StitchLine: FC<StitchLineProps> = ({ stitchLine, computedStitchLine }) => {
  return (
    <g data-stitch-line-id={stitchLine.id} pointerEvents="none">
      {computedStitchLine.routes.map((route, index) => (
        <StitchLineRoute key={index} route={route} settings={stitchLine} />
      ))}
    </g>
  )
}
