import type { FC } from 'react'

import { usePath } from '../../hooks/usePath'
import type { PathSchema } from '../../schemas/geometry'

type TPocketProps = {
  path: PathSchema
  fill: string | undefined
  stroke: string | undefined
  strokeWidth: number | undefined
  filter?: string
}

export const TPocket: FC<TPocketProps> = ({ fill, path, filter, stroke, strokeWidth }) => {
  const pathData = usePath(path)

  return <path d={pathData} fill={fill} stroke={stroke} strokeWidth={strokeWidth} filter={filter} />
}
