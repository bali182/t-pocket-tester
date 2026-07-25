import { useCallback, useState, type FC, type MouseEventHandler, type PointerEventHandler } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { useComponent } from '../../hooks/useComponent'
import { useComputedComponent } from '../../hooks/useComputedComponent'
import { usePath } from '../../hooks/usePath'
import type { PanelSchema } from '../../schemas/components'
import type { ComputedPanelSchema } from '../../schemas/computed'
import { PocketCluster } from './PocketCluster'
import { StitchLines } from './StitchLines'

type PanelProps = {
  componentId: string
}

export const Panel: FC<PanelProps> = ({ componentId }) => {
  const { componentStyles, isInteractive, selection } = useDrawAreaContext()
  const [isHovered, setIsHovered] = useState(false)
  const panel = useComponent<PanelSchema>(componentId)
  const computedPanel = useComputedComponent<ComputedPanelSchema>(componentId)
  const pathData = usePath(computedPanel.path)

  const handlePointerEnter = useCallback<PointerEventHandler<SVGPathElement>>(() => {
    setIsHovered(true)
  }, [])
  const handlePointerLeave = useCallback<PointerEventHandler<SVGPathElement>>(() => {
    setIsHovered(false)
  }, [])
  const handleClick = useCallback<MouseEventHandler<SVGPathElement>>(
    (event) => {
      event.stopPropagation()
      selection.selectComponent(panel.id)
    },
    [panel.id, selection],
  )

  return (
    <>
      <path
        d={pathData}
        fill={componentStyles.getBackgroundColor(panel, isHovered)}
        filter={componentStyles.getFilter(panel, isHovered)}
        stroke={componentStyles.getBorderColor(panel, isHovered)}
        strokeWidth={componentStyles.getBorderThickness(panel, isHovered)}
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
