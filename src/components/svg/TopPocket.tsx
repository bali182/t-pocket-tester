import type { FC } from 'react'

import type { TopPocketModel } from '../../types'

type TopPocketProps = {
  pocket: TopPocketModel
  fill: string
}

export const TopPocket: FC<TopPocketProps> = ({ fill, pocket }) => {
  return (
    <rect
      x={pocket.outline.x}
      y={pocket.outline.y}
      width={pocket.outline.width}
      height={pocket.outline.height}
      fill={fill}
    />
  )
}
