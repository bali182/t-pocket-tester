import type { FC } from 'react'

import type { TPocketStitchLinesSchema } from '../../schemas/TPocketStitchLinesSchema'
import { Line } from './Line'

type TPocketStitchLinesProps = {
  stitchLines: TPocketStitchLinesSchema
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
