import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import type { ComputedStitchHoleSchema } from '../../schemas/computed'
import type { ResolvedStitchLineSchema } from '../../schemas/stitching'

type StitchHoleProps = {
  hole: ComputedStitchHoleSchema
  stitchLine: ResolvedStitchLineSchema
}

export const StitchHole: FC<StitchHoleProps> = ({ hole, stitchLine }) => {
  const { stitchLineStyles } = useDrawAreaContext()

  return (
    <line
      x1={hole.line.start.x.toNumber()}
      y1={hole.line.start.y.toNumber()}
      x2={hole.line.end.x.toNumber()}
      y2={hole.line.end.y.toNumber()}
      stroke={stitchLineStyles.getStitchHoleColor(stitchLine)}
      strokeWidth={stitchLineStyles.getStitchHoleThickness(stitchLine)}
    />
  )
}
