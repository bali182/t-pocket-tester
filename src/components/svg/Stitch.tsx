import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { getStitchHoleLine } from '../../logic/stitching/getStitchHoleLine'
import type { ResolvedStitchLineSchema, StitchHoleSchema } from '../../schemas/stitching'

type StitchProps = {
  fromHole: StitchHoleSchema
  toHole: StitchHoleSchema
  stitchLine: ResolvedStitchLineSchema
}

export const Stitch: FC<StitchProps> = ({ fromHole, toHole, stitchLine }) => {
  const { stitchLineStyles } = useDrawAreaContext()
  const fromLine = getStitchHoleLine(fromHole, stitchLine.stitchHoleLength)
  const toLine = getStitchHoleLine(toHole, stitchLine.stitchHoleLength)

  return (
    <line
      x1={fromLine.end.x}
      y1={fromLine.end.y}
      x2={toLine.start.x}
      y2={toLine.start.y}
      stroke={stitchLineStyles.getThreadColor(stitchLine)}
      strokeLinecap="round"
      strokeWidth={stitchLineStyles.getThreadThickness(stitchLine)}
    />
  )
}
