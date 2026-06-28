import type { FC } from 'react'

import { STROKE_COLOR, STROKE_THICKNESS } from '../../constants'
import type { StitchHoleModel } from '../../schemas/StitchHoleModelSchema'

type StitchHoleProps = {
  hole: StitchHoleModel
}

export const StitchHole: FC<StitchHoleProps> = ({ hole: { length, center, rotation = 0 } }) => {
  const angleInRadians = ((45 + rotation) * Math.PI) / 180
  const halfLength = length / 2
  const dx = Math.cos(angleInRadians) * halfLength
  const dy = Math.sin(angleInRadians) * halfLength

  return (
    <line
      x1={center.x - dx}
      y1={center.y - dy}
      x2={center.x + dx}
      y2={center.y + dy}
      stroke={STROKE_COLOR}
      strokeWidth={STROKE_THICKNESS}
    />
  )
}
