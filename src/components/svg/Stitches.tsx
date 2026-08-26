import type { FC } from 'react'

import type { StitchHoleSchema, StitchLineSchema } from '../../schemas/stitching'
import { Stitch } from './Stitch'

type StitchesProps = {
  holes: StitchHoleSchema[]
  isClosed: boolean
  stitchHoleLength: number
  stitchLine: StitchLineSchema
}

export const Stitches: FC<StitchesProps> = ({ holes, isClosed, stitchHoleLength, stitchLine }) => {
  if (holes.length < 2) {
    return null
  }

  return (
    <>
      {holes.slice(1).map((toHole, index) => (
        <Stitch
          fromHole={holes[index]}
          key={index}
          stitchHoleLength={stitchHoleLength}
          stitchLine={stitchLine}
          toHole={toHole}
        />
      ))}
      {isClosed && (
        <Stitch
          fromHole={holes[holes.length - 1]}
          stitchHoleLength={stitchHoleLength}
          stitchLine={stitchLine}
          toHole={holes[0]}
        />
      )}
    </>
  )
}
