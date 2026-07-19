import type { FC } from 'react'

import { usePath } from '../../hooks/usePath'
import type { ComputedStitchRouteSchema } from '../../schemas/computed'
import type { StitchLineCommonConfigSchema } from '../../schemas/stitching'
import { StitchHole } from './StitchHole'

type StitchLineRouteProps = {
  route: ComputedStitchRouteSchema
  settings: StitchLineCommonConfigSchema
}

export const StitchLineRoute: FC<StitchLineRouteProps> = ({ route, settings }) => {
  const pathData = usePath(route.path)

  return (
    <g>
      <path fill="none" d={pathData} stroke={settings.stitchLineColor} strokeWidth={settings.stitchLineThickness} />
      {route.holes.map((hole, index) => (
        <StitchHole key={index} hole={hole} settings={settings} />
      ))}
    </g>
  )
}
