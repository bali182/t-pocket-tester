import { useMemo, type FC } from 'react'

import type { PointSchema } from '../../schemas/geometry'

type TPocketProps = {
  points: PointSchema[]
  fill: string
  stroke: string
  strokeWidth: number
}

export const TPocket: FC<TPocketProps> = ({ fill, points, stroke, strokeWidth }) => {
  const pointString = useMemo(() => points.map((point) => `${point.x},${point.y}`).join(' '), [points])

  return <polygon fill={fill} points={pointString} stroke={stroke} strokeWidth={strokeWidth} />
}
