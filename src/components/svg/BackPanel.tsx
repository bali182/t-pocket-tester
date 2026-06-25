import type { FC } from 'react'

import { BACK_PANEL_COLOR } from '../../constants'
import type { BackPanelModel } from '../../types'

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
      fill={BACK_PANEL_COLOR}
    />
  )
}
