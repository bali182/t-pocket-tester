import { useCallback, useMemo, useState, type FC, type MouseEventHandler, type PointerEventHandler } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { useLayout } from '../../hooks/useLayout'
import type { RootPanelSchema } from '../../schemas/components'
import { RectSchema } from '../../schemas/geometry'
import { Panel } from './Panel'

type RootPanelProps = {
  rootPanel: RootPanelSchema
}

export const RootPanel: FC<RootPanelProps> = ({ rootPanel }) => {
  const { getHoverBackgroundColor, isInteractive, onComponentClick } = useDrawAreaContext()
  const [isHovered, setIsHovered] = useState(false)
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
  const fill = isHovered && isInteractive ? getHoverBackgroundColor(rootPanel) : rootPanel.color
  const handlePointerEnter = useCallback<PointerEventHandler<SVGRectElement>>(() => {
    setIsHovered(true)
  }, [])
  const handlePointerLeave = useCallback<PointerEventHandler<SVGRectElement>>(() => {
    setIsHovered(false)
  }, [])
  const handleClick = useCallback<MouseEventHandler<SVGRectElement>>(
    (event) => {
      event.stopPropagation()
      onComponentClick(rootPanel, event.currentTarget)
    },
    [onComponentClick, rootPanel],
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
