import type { FC } from 'react'

import type { TPocketStitchLinesModel } from '../../schemas/TPocketStitchLinesModelSchema'
import { Line } from './Line'

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
