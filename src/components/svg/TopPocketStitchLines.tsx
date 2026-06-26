import type { FC } from 'react'

import type { TopPocketStitchLinesModel } from '../../types'
import { Line } from './Line'

type TopPocketStitchLinesProps = {
  stitchLines: TopPocketStitchLinesModel
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
