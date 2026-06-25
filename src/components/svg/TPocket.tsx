import type { FC } from 'react'
import { useMemo } from 'react'

import type { TPocketModel } from '../../types'

type TPocketProps = {
  pocket: TPocketModel
  fill: string
}

export const TPocket: FC<TPocketProps> = ({ fill, pocket }) => {
  const points = useMemo(() => {
    return pocket.outline.points.map((point) => `${point.x},${point.y}`).join(' ')
  }, [pocket.outline.points])

  return <polygon points={points} fill={fill} />
}
