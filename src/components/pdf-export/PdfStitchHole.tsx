import { Line } from '@react-pdf/renderer'
import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { getStitchHoleLine } from '../../logic/stitching/getStitchHoleLine'
import type { StitchHoleSchema, StitchLineSchema } from '../../schemas/stitching'

type PdfStitchHoleProps = {
  hole: StitchHoleSchema
  stitchHoleLength: number
  stitchLine: StitchLineSchema
}

export const PdfStitchHole: FC<PdfStitchHoleProps> = ({ hole, stitchHoleLength, stitchLine }) => {
  const { stitchLineStyles } = useDrawAreaContext()
  const line = getStitchHoleLine(hole, stitchHoleLength)

  return (
    <Line
      stroke={stitchLineStyles.getStitchHoleColor(stitchLine)}
      strokeWidth={stitchLineStyles.getStitchHoleThickness(stitchLine)}
      x1={line.start.x}
      x2={line.end.x}
      y1={line.start.y}
      y2={line.end.y}
    />
  )
}
