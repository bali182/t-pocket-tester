import { useMemo } from 'react'
import type { FC } from 'react'

import type { TPocket } from '../types'

type Props = {
  pocket: TPocket
  fill: string
}

export const TPocketSvg: FC<Props> = ({ fill, pocket }) => {
  const points = useMemo(() => {
    return pocket.outline.points.map((point) => `${point.x},${point.y}`).join(' ')
  }, [pocket.outline.points])

  return (
    <polygon
      points={points}
      fill={fill}
    />
  )
}
