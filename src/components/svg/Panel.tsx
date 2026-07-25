import { useCallback, useState, type FC, type MouseEventHandler, type PointerEventHandler } from 'react'

import { STROKE_THICKNESS } from '../../constants/drawing'
import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { useComponent } from '../../hooks/useComponent'
import { useComputedComponent } from '../../hooks/useComputedComponent'
import { usePath } from '../../hooks/usePath'
import type { PanelSchema } from '../../schemas/components'
import type { ComputedPanelSchema } from '../../schemas/computed'
import { PocketCluster } from './PocketCluster'
import { StitchLines } from './StitchLines'
import { useSvgElementStyle } from './useSvgElementStyle'

type PanelProps = {
  componentId: string
}

export const Panel: FC<PanelProps> = ({ componentId }) => {
  const { isInteractive, selectComponent } = useDrawAreaContext()
  const [isHovered, setIsHovered] = useState(false)
  const panel = useComponent<PanelSchema>(componentId)
  const computedPanel = useComputedComponent<ComputedPanelSchema>(componentId)
  const pathData = usePath(computedPanel.path)
  const svgStyles = useSvgElementStyle(panel, isHovered)

  const handlePointerEnter = useCallback<PointerEventHandler<SVGPathElement>>(() => {
    setIsHovered(true)
  }, [])
  const handlePointerLeave = useCallback<PointerEventHandler<SVGPathElement>>(() => {
    setIsHovered(false)
  }, [])
  const handleClick = useCallback<MouseEventHandler<SVGPathElement>>(
    (event) => {
      event.stopPropagation()
      selectComponent(panel.id)
    },
    [panel.id, selectComponent],
  )

  return (
    <>
      <path
        {...svgStyles.element}
        d={pathData}
        strokeWidth={STROKE_THICKNESS}
        data-component-id={panel.id}
        onPointerEnter={isInteractive ? handlePointerEnter : undefined}
        onPointerLeave={isInteractive ? handlePointerLeave : undefined}
        onClick={isInteractive ? handleClick : undefined}
      />

      <StitchLines componentId={panel.id} />

      {computedPanel.children.map((component) => {
        switch (component.type) {
          case 'computed-panel':
            return <Panel key={component.componentId} componentId={component.componentId} />
          case 'computed-pocket-cluster':
            return <PocketCluster key={component.componentId} componentId={component.componentId} />
          case 'computed-root-panel':
            throw new Error(`Root panel cannot be rendered as a child: ${component.componentId}`)
        }
      })}
    </>
  )
}
