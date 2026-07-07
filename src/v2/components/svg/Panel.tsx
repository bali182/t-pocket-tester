import { useCallback, useState, type FC, type MouseEventHandler, type PointerEventHandler } from 'react'

import { STROKE_THICKNESS } from '../../constants/drawing'
import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { useComponent } from '../../hooks/useComponent'
import { useComputedComponent } from '../../hooks/useComputedComponent'
import type { PanelSchema } from '../../schemas/components'
import type { ComputedPanelSchema } from '../../schemas/computed'
import { PocketCluster } from './PocketCluster'
import { useSvgElementStyle } from './useSvgElementStyle'

type PanelProps = {
  componentId: string
}

export const Panel: FC<PanelProps> = ({ componentId }) => {
  const { isInteractive, onComponentClick } = useDrawAreaContext()
  const [isHovered, setIsHovered] = useState(false)
  const panel = useComponent<PanelSchema>(componentId)
  const computedPanel = useComputedComponent<ComputedPanelSchema>(componentId)
  const svgStyles = useSvgElementStyle(panel, isHovered)

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
        {...svgStyles.element}
        x={computedPanel.boundingRect.x}
        y={computedPanel.boundingRect.y}
        width={computedPanel.boundingRect.width}
        height={computedPanel.boundingRect.height}
        strokeWidth={STROKE_THICKNESS}
        data-component-id={panel.id}
        onPointerEnter={isInteractive ? handlePointerEnter : undefined}
        onPointerLeave={isInteractive ? handlePointerLeave : undefined}
        onClick={isInteractive ? handleClick : undefined}
      />

      {computedPanel.children.map((component) => {
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
