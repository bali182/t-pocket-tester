import { useMemo, type FC } from 'react'

import { useLayout } from '../../hooks/useLayout'
import type { RootPanelSchema } from '../../schemas/components'
import { RectSchema } from '../../schemas/geometry'
import { Panel } from './Panel'

type RootPanelProps = {
  rootPanel: RootPanelSchema
}

export const RootPanel: FC<RootPanelProps> = ({ rootPanel }) => {
  const rect = useMemo<RectSchema>(
    () => ({
      x: 0,
      y: 0,
      width: rootPanel.size.width,
      height: rootPanel.size.height,
    }),
    [rootPanel.size.height, rootPanel.size.width],
  )
  const children = useLayout({ rect, component: rootPanel })

  return (
    <>
      <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} fill={rootPanel.color} />

      {children.map(([panel, rect]) => (
        <Panel key={panel.id} panel={panel} rect={rect} />
      ))}
    </>
  )
}
