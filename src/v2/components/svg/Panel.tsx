import type { FC } from 'react'

import { useLayout } from '../../hooks/useLayout'
import type { PanelSchema } from '../../schemas/components'
import type { RectSchema } from '../../schemas/geometry'

type PanelProps = {
  panel: PanelSchema
  rect: RectSchema
}

export const Panel: FC<PanelProps> = ({ panel, rect }) => {
  const children = useLayout({ rect, component: panel })

  return (
    <>
      <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} fill={panel.color} />

      {children.map(([panel, rect]) => (
        <Panel key={panel.id} panel={panel} rect={rect} />
      ))}
    </>
  )
}
