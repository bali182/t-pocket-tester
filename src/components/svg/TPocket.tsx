import type { FC } from 'react'
import { useMemo } from 'react'

import type { TPocketModel } from '../../types'

type TPocketPropsBase = {
  pocket: TPocketModel
}

type TPocketStrokeProps = TPocketPropsBase & {
  fill?: never
  stroke: string
  strokeWidth: number
}

type TPocketFillProps = TPocketPropsBase & {
  fill: string
  stroke?: never
  strokeWidth?: never
}

type TPocketProps = TPocketStrokeProps | TPocketFillProps

export const TPocket: FC<TPocketProps> = ({ fill, pocket, stroke, strokeWidth }) => {
  const points = useMemo(() => {
    return pocket.outline.points.map((point) => `${point.x},${point.y}`).join(' ')
  }, [pocket.outline.points])

  return <polygon points={points} fill={fill ?? 'none'} stroke={stroke} strokeWidth={strokeWidth} />
}
