import { useCallback, useState, type FC, type MouseEventHandler, type PointerEventHandler } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { useLayout } from '../../hooks/useLayout'
import type { PanelSchema } from '../../schemas/components'
import type { RectSchema } from '../../schemas/geometry'

type PanelProps = {
  panel: PanelSchema
  rect: RectSchema
}

export const Panel: FC<PanelProps> = ({ panel, rect }) => {
  const { getHoverBackgroundColor, isInteractive, onComponentClick } = useDrawAreaContext()
  const [isHovered, setIsHovered] = useState(false)
  const children = useLayout({ rect, component: panel })
  const fill = isHovered && isInteractive ? getHoverBackgroundColor(panel) : panel.color
  const handlePointerEnter = useCallback<PointerEventHandler<SVGRectElement>>(() => {
    setIsHovered(true)
  }, [])
  const handlePointerLeave = useCallback<PointerEventHandler<SVGRectElement>>(() => {
    setIsHovered(false)
  }, [])
  const handleClick = useCallback<MouseEventHandler<SVGRectElement>>(
    (event) => {
      event.stopPropagation()
      onComponentClick(panel, event.currentTarget)
    },
    [onComponentClick, panel],
  )

  return (
    <>
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        fill={fill}
        onPointerEnter={isInteractive ? handlePointerEnter : undefined}
        onPointerLeave={isInteractive ? handlePointerLeave : undefined}
        onClick={isInteractive ? handleClick : undefined}
      />

      {children.map(([panel, rect]) => (
        <Panel key={panel.id} panel={panel} rect={rect} />
      ))}
    </>
  )
}
