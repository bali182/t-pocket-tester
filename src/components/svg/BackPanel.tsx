import type { FC } from 'react'

import { LEATHER_BASE_COLOR } from '../../constants'
import type { BackPanelModel } from '../../schemas/BackPanelModelSchema'

type BackPanelProps = {
  backPanel: BackPanelModel
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
