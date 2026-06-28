import type { FC } from 'react'

import type { TopPocketModel } from '../../schemas/TopPocketModelSchema'

type TopPocketPropsBase = {
  pocket: TopPocketModel
}

type TopPocketFillProps = TopPocketPropsBase & {
  fill: string
  stroke?: never
  strokeWidth?: never
}

type TopPocketStrokeProps = TopPocketPropsBase & {
  fill?: never
  stroke: string
  strokeWidth: number
}

type TopPocketProps = TopPocketFillProps | TopPocketStrokeProps

export const TopPocket: FC<TopPocketProps> = ({ fill, pocket, stroke, strokeWidth }) => {
  return (
    <rect
      x={pocket.outline.x}
      y={pocket.outline.y}
      width={pocket.outline.width}
      height={pocket.outline.height}
      fill={fill ?? 'none'}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  )
}
