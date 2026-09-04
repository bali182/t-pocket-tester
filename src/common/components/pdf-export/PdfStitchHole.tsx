import { Line } from '@react-pdf/renderer'
import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import type { ComputedStitchHoleSchema } from '../../schemas/computed'
import type { ResolvedStitchLineSchema } from '../../schemas/stitching'

type PdfStitchHoleProps = {
  hole: ComputedStitchHoleSchema
  stitchLine: ResolvedStitchLineSchema
}

export const PdfStitchHole: FC<PdfStitchHoleProps> = ({ hole, stitchLine }) => {
  const { stitchLineStyles } = useDrawAreaContext()

  return (
    <Line
      stroke={stitchLineStyles.getStitchHoleColor(stitchLine)}
      strokeWidth={stitchLineStyles.getStitchHoleThickness(stitchLine)}
      x1={hole.line.start.x.toNumber()}
      x2={hole.line.end.x.toNumber()}
      y1={hole.line.start.y.toNumber()}
      y2={hole.line.end.y.toNumber()}
    />
  )
}
