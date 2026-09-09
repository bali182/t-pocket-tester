import type { FC } from 'react'

import { useExportDrawAreaContext } from '../../contexts/ExportDrawAreaContext'
import type { ComputedStitchHoleSchema } from '../../schemas/computed'
import type { ResolvedStitchLineSchema } from '../../schemas/stitching'

type ExportStitchHoleProps = {
  hole: ComputedStitchHoleSchema
  stitchLine: ResolvedStitchLineSchema
}

export const ExportStitchHole: FC<ExportStitchHoleProps> = ({ hole, stitchLine }) => {
  const { stitchLineStyles } = useExportDrawAreaContext()

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
