import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { getStitchHoleLine } from '../../logic/stitching/getStitchHoleLine'
import { StitchHoleSchema, StitchLineSchema } from '../../schemas/stitching'

type StitchHoleProps = {
  hole: StitchHoleSchema
  stitchHoleLength: number
  stitchLine: StitchLineSchema
}

export const StitchHole: FC<StitchHoleProps> = ({ hole, stitchHoleLength, stitchLine }) => {
  const { stitchLineStyles } = useDrawAreaContext()
  const line = getStitchHoleLine(hole, stitchHoleLength)

  return (
    <line
      x1={line.start.x}
      y1={line.start.y}
      x2={line.end.x}
      y2={line.end.y}
      stroke={stitchLineStyles.getStitchHoleColor(stitchLine)}
      strokeWidth={stitchLineStyles.getStitchHoleThickness(stitchLine)}
    />
  )
}
