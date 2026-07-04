import { useCallback, useState, type FC, type MouseEventHandler, type PointerEventHandler } from 'react'

import { STROKE_COLOR, STROKE_THICKNESS } from '../../constants/drawing'
import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { useLayout } from '../../hooks/useLayout'
import type { PanelSchema } from '../../schemas/components'
import type { RectSchema } from '../../schemas/geometry'
import { PocketCluster } from './PocketCluster'

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
        stroke={STROKE_COLOR}
        strokeWidth={STROKE_THICKNESS}
        data-component-id={panel.id}
        onPointerEnter={isInteractive ? handlePointerEnter : undefined}
        onPointerLeave={isInteractive ? handlePointerLeave : undefined}
        onClick={isInteractive ? handleClick : undefined}
      />

      {children.map(([component, rect]) => {
        switch (component.type) {
          case 'panel':
            return <Panel key={component.id} panel={component} rect={rect} />
          case 'pocket-cluster':
            return <PocketCluster key={component.id} pocketCluster={component} rect={rect} />
        }
      })}
    </>
  )
}
