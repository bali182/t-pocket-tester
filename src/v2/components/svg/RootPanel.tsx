import { useCallback, useMemo, useState, type FC, type MouseEventHandler, type PointerEventHandler } from 'react'

import { STROKE_THICKNESS } from '../../constants/drawing'
import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { useLayout } from '../../hooks/useLayout'
import type { RootPanelSchema } from '../../schemas/components'
import { RectSchema } from '../../schemas/geometry'
import { Panel } from './Panel'
import { PocketCluster } from './PocketCluster'
import { useSvgElementStyle } from './useSvgElementStyle'

type RootPanelProps = {
  rootPanel: RootPanelSchema
}

export const RootPanel: FC<RootPanelProps> = ({ rootPanel }) => {
  const { isInteractive, onComponentClick } = useDrawAreaContext()
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
  const styles = useSvgElementStyle(rootPanel, isHovered)

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
        {...styles}
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        strokeWidth={STROKE_THICKNESS}
        data-component-id={rootPanel.id}
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
