import type { FC } from 'react'

import { STROKE_COLOR, STROKE_THICKNESS } from '../../constants'
import type { LineModel } from '../../types'

type LineProps = {
  line: LineModel
}

export const Line: FC<LineProps> = ({ line }) => {
  return (
    <line
      x1={line.start.x}
      y1={line.start.y}
      x2={line.end.x}
      y2={line.end.y}
      stroke={STROKE_COLOR}
      strokeWidth={STROKE_THICKNESS}
    />
  )
}
