import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import type { ComputedStitchSchema } from '../../schemas/computed'
import type { ResolvedStitchLineSchema } from '../../schemas/stitching'

type StitchProps = {
  stitch: ComputedStitchSchema
  stitchLine: ResolvedStitchLineSchema
}

export const Stitch: FC<StitchProps> = ({ stitch, stitchLine }) => {
  const { stitchLineStyles } = useDrawAreaContext()

  return (
    <line
      x1={stitch.line.start.x.toNumber()}
      y1={stitch.line.start.y.toNumber()}
      x2={stitch.line.end.x.toNumber()}
      y2={stitch.line.end.y.toNumber()}
      stroke={stitchLineStyles.getThreadColor(stitchLine)}
      strokeLinecap="round"
      strokeWidth={stitchLineStyles.getThreadThickness(stitchLine)}
    />
  )
}
