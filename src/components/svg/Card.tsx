import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
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

  return (
    <path
      d={pathData}
      fill={cardStyles.getBackgroundColor(owner, isParentHovered)}
      stroke={cardStyles.getStrokeColor(owner, isParentHovered)}
      strokeWidth={cardStyles.getStrokeThickness(owner, isParentHovered)}
    />
  )
}
