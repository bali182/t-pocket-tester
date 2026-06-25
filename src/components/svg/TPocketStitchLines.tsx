import type { FC } from 'react'

import { STROKE_COLOR, STROKE_THICKNESS } from '../../constants'
import type { LineModel, TPocketStitchLinesModel } from '../../types'

type TPocketStitchLinesProps = {
  stitchLines: TPocketStitchLinesModel
}

export const TPocketStitchLines: FC<TPocketStitchLinesProps> = ({ stitchLines }) => {
  const { leftTabStitchLine, rightTabStitchLine, bottomStitchLine } = stitchLines
  return (
    <>
      <Line line={leftTabStitchLine} />
      <Line line={rightTabStitchLine} />
      <Line line={bottomStitchLine} />
    </>
  )
}

type LineProps = {
  line: LineModel
}

const Line: FC<LineProps> = ({ line }) => {
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
