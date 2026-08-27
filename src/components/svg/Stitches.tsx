import type { FC } from 'react'

import type { ResolvedStitchLineSchema, StitchHoleSchema } from '../../schemas/stitching'
import { Stitch } from './Stitch'

type StitchesProps = {
  holes: StitchHoleSchema[]
  isClosed: boolean
  stitchLine: ResolvedStitchLineSchema
}

export const Stitches: FC<StitchesProps> = ({ holes, isClosed, stitchLine }) => {
  if (holes.length < 2) {
    return null
  }

  return (
    <>
      {holes.slice(1).map((toHole, index) => (
        <Stitch fromHole={holes[index]} key={index} stitchLine={stitchLine} toHole={toHole} />
      ))}
      {isClosed && <Stitch fromHole={holes[holes.length - 1]} stitchLine={stitchLine} toHole={holes[0]} />}
    </>
  )
}
