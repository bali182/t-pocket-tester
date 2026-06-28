import type { FC } from 'react'

import { LEATHER_BASE_COLOR } from '../../constants'
import type { BackPanelSchema } from '../../schemas/BackPanelSchema'

type BackPanelProps = {
  backPanel: BackPanelSchema
}

export const BackPanel: FC<BackPanelProps> = ({ backPanel }) => {
  return (
    <rect
      x={backPanel.outline.x}
      y={backPanel.outline.y}
      width={backPanel.outline.width}
      height={backPanel.outline.height}
      fill={LEATHER_BASE_COLOR}
    />
  )
}
