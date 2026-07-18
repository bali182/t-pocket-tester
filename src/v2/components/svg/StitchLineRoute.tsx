import type { FC } from 'react'

import { STROKE_THICKNESS } from '../../constants/drawing'
import { usePath } from '../../hooks/usePath'
import type { ComputedStitchRouteSchema } from '../../schemas/computed'
import type { StitchingSettingsSchema } from '../../schemas/stitching'
import { StitchHole } from './StitchHole'

type StitchLineRouteProps = {
  route: ComputedStitchRouteSchema
  settings: StitchingSettingsSchema
}

export const StitchLineRoute: FC<StitchLineRouteProps> = ({ route, settings }) => {
  const pathData = usePath(route.path)

  return (
    <g>
      <path fill="none" d={pathData} stroke={settings.stitchLineColor} strokeWidth={STROKE_THICKNESS} />
      {route.holes.map((hole, index) => (
        <StitchHole key={index} hole={hole} settings={settings} />
      ))}
    </g>
  )
}
