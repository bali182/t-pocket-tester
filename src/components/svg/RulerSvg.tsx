import type { FC } from 'react'

import { STROKE_COLOR, STROKE_THICKNESS } from '../../constants'

const tickPositions = Array.from({ length: 9 }, (_value, index) => (index + 1) * 10)

export const RulerSvg: FC = () => {
  return (
    <svg width="100mm" height="5mm" viewBox="0 0 100 5">
      <line x1={0} y1={5} x2={100} y2={5} stroke={STROKE_COLOR} strokeWidth={STROKE_THICKNESS} />
      <line x1={0} y1={0} x2={0} y2={5} stroke={STROKE_COLOR} strokeWidth={STROKE_THICKNESS} />
      <line x1={100} y1={0} x2={100} y2={5} stroke={STROKE_COLOR} strokeWidth={STROKE_THICKNESS} />

      {tickPositions.map((position) => (
        <line
          key={position}
          x1={position}
          y1={2}
          x2={position}
          y2={5}
          stroke={STROKE_COLOR}
          strokeWidth={STROKE_THICKNESS}
        />
      ))}
    </svg>
  )
}
