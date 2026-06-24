import type { FC } from 'react'

import type { PlainPocket } from '../types'

type PlainPocketSvgProps = {
  pocket: PlainPocket
  fill: string
}

export const PlainPocketSvg: FC<PlainPocketSvgProps> = ({ fill, pocket }) => {
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
