import type { FC } from 'react'

import type { StitchLineSchema } from '../../schemas/stitching'
import { StitchLineSidesAndCorners } from './StitchLineSidesAndCorners'

type StitchLineEditorProps = {
  stitchLine: StitchLineSchema
}

export const StitchLineEditor: FC<StitchLineEditorProps> = () => {
  return (
    <>
      <StitchLineSidesAndCorners />
    </>
  )
}
