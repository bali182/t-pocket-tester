import { useCallback, useState, type FC, type MouseEventHandler, type PointerEventHandler } from 'react'

import { STROKE_THICKNESS } from '../../constants/drawing'
import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { useComponent } from '../../hooks/useComponent'
import { useComputedComponent } from '../../hooks/useComputedComponent'
import type { RootPanelSchema } from '../../schemas/components'
import type { ComputedRootPanelSchema } from '../../schemas/computed'
import { Panel } from './Panel'
import { PocketCluster } from './PocketCluster'
import { useSvgElementStyle } from './useSvgElementStyle'

type RootPanelProps = {
  componentId: string
}

export const RootPanel: FC<RootPanelProps> = ({ componentId }) => {
  const { isInteractive, onComponentClick } = useDrawAreaContext()
  const [isHovered, setIsHovered] = useState(false)
  const rootPanel = useComponent<RootPanelSchema>(componentId)
  const computedRootPanel = useComputedComponent<ComputedRootPanelSchema>(componentId)
  const svgStyles = useSvgElementStyle(rootPanel, isHovered)

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
        {...svgStyles.element}
        x={computedRootPanel.boundingRect.x}
        y={computedRootPanel.boundingRect.y}
        width={computedRootPanel.boundingRect.width}
        height={computedRootPanel.boundingRect.height}
        strokeWidth={STROKE_THICKNESS}
        data-component-id={rootPanel.id}
        onPointerEnter={isInteractive ? handlePointerEnter : undefined}
        onPointerLeave={isInteractive ? handlePointerLeave : undefined}
        onClick={isInteractive ? handleClick : undefined}
      />

      {computedRootPanel.children.map((component) => {
        switch (component.type) {
          case 'panel':
            return <Panel key={component.componentId} componentId={component.componentId} />
          case 'pocket-cluster':
            return <PocketCluster key={component.componentId} componentId={component.componentId} />
          case 'root-panel':
            throw new Error(`Root panel cannot be rendered as a child: ${component.componentId}`)
        }
      })}
    </>
  )
}
