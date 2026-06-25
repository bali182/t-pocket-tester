import type { FC } from 'react'

import type { PlainPocketModel } from '../../types'

type PlainPocketProps = {
  pocket: PlainPocketModel
  fill: string
}

export const PlainPocket: FC<PlainPocketProps> = ({ fill, pocket }) => {
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
