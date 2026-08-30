import type { FC } from 'react'

import type { ComputedStitchSchema } from '../../schemas/computed'
import type { ResolvedStitchLineSchema } from '../../schemas/stitching'
import { Stitch } from './Stitch'

type StitchesProps = {
  stitches: ComputedStitchSchema[]
  stitchLine: ResolvedStitchLineSchema
}

export const Stitches: FC<StitchesProps> = ({ stitches, stitchLine }) => {
  return (
    <>
      {stitches.map((stitch, index) => (
        <Stitch key={index} stitch={stitch} stitchLine={stitchLine} />
      ))}
    </>
  )
}
