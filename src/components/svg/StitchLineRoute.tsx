import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { usePath } from '../../hooks/usePath'
import type { ComputedStitchRouteSchema } from '../../schemas/computed'
import type { StitchLineSchema } from '../../schemas/stitching'
import { StitchHole } from './StitchHole'

type StitchLineRouteProps = {
  route: ComputedStitchRouteSchema
  stitchHoleLength: number
  stitchLine: StitchLineSchema
}

export const StitchLineRoute: FC<StitchLineRouteProps> = ({ route, stitchHoleLength, stitchLine }) => {
  const { stitchLineStyles } = useDrawAreaContext()
  const pathData = usePath(route.path)

  return (
    <g>
      <path
        d={pathData}
        fill="none"
        stroke={stitchLineStyles.getLineColor(stitchLine)}
        strokeWidth={stitchLineStyles.getLineThickness(stitchLine)}
      />
      {route.holes.map((hole, index) => (
        <StitchHole key={index} hole={hole} stitchHoleLength={stitchHoleLength} stitchLine={stitchLine} />
      ))}
    </g>
  )
}
