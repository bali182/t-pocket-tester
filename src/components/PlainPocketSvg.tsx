import type { FC } from 'react'

import type { PlainPocket } from '../types'

type Props = {
  pocket: PlainPocket
  fill: string
}

export const PlainPocketSvg: FC<Props> = ({ fill, pocket }) => {
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
