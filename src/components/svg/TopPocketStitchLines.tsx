import type { FC } from 'react'

import type { TopPocketStitchLinesSchema } from '../../schemas/TopPocketStitchLinesSchema'
import { Line } from './Line'

type TopPocketStitchLinesProps = {
  stitchLines: TopPocketStitchLinesSchema
}

export const TopPocketStitchLines: FC<TopPocketStitchLinesProps> = ({ stitchLines }) => {
  const { leftStitchLine, rightStitchLine, bottomStitchLine } = stitchLines

  return (
    <>
      <Line line={leftStitchLine} />
      <Line line={rightStitchLine} />
      <Line line={bottomStitchLine} />
    </>
  )
}
