import type { FC } from 'react'

import { BACK_PANEL_COLOR } from '../constants'
import type { BackPanel } from '../types'

type BackPanelSvgProps = {
  backPanel: BackPanel
}

export const BackPanelSvg: FC<BackPanelSvgProps> = ({ backPanel }) => {
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
