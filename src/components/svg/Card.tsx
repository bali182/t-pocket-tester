import type { FC } from 'react'

import { useDrawAreaContext, type DrawAreaCardStyleParams } from '../../contexts/DrawAreaContext'
import { usePath } from '../../hooks/usePath'
import type { PocketClusterSchema } from '../../schemas/components'
import type { PathSchema } from '../../schemas/geometry'

type CardProps = {
  owner: PocketClusterSchema
  path: PathSchema
  isParentHovered: boolean
}

export const Card: FC<CardProps> = ({ isParentHovered, owner, path }) => {
  const { cardStyles } = useDrawAreaContext()
  const pathData = usePath(path)
  const styleParams: DrawAreaCardStyleParams = { isHovered: isParentHovered, owner }

  return (
    <path
      d={pathData}
      fill={cardStyles.getBackgroundColor(styleParams)}
      stroke={cardStyles.getStrokeColor(styleParams)}
      strokeWidth={cardStyles.getStrokeThickness(styleParams)}
    />
  )
}
