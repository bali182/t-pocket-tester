import { useCallback, useState, type FC, type MouseEventHandler, type PointerEventHandler } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { useComponent } from '../../hooks/useComponent'
import { useComputedComponent } from '../../hooks/useComputedComponent'
import { usePath } from '../../hooks/usePath'
import type { RootPanelSchema } from '../../schemas/components'
import type { ComputedRootPanelSchema } from '../../schemas/computed'
import { Panel } from './Panel'
import { PocketCluster } from './PocketCluster'
import { StitchLines } from './StitchLines'

type RootPanelProps = {
  componentId: string
}

export const RootPanel: FC<RootPanelProps> = ({ componentId }) => {
  const { componentStyles, isInteractive, selection } = useDrawAreaContext()
  const [isHovered, setIsHovered] = useState(false)
  const rootPanel = useComponent<RootPanelSchema>(componentId)
  const computedRootPanel = useComputedComponent<ComputedRootPanelSchema>(componentId)
  const pathData = usePath(computedRootPanel.path)

  const handlePointerEnter = useCallback<PointerEventHandler<SVGPathElement>>(() => {
    setIsHovered(true)
  }, [])
  const handlePointerLeave = useCallback<PointerEventHandler<SVGPathElement>>(() => {
    setIsHovered(false)
  }, [])
  const handleClick = useCallback<MouseEventHandler<SVGPathElement>>(
    (event) => {
      event.stopPropagation()
      selection.selectComponent(rootPanel.id)
    },
    [rootPanel.id, selection],
  )

  return (
    <>
      <path
        d={pathData}
        fill={componentStyles.getBackgroundColor(rootPanel, isHovered)}
        filter={componentStyles.getFilter(rootPanel, isHovered)}
        stroke={componentStyles.getBorderColor(rootPanel, isHovered)}
        strokeWidth={componentStyles.getBorderThickness(rootPanel, isHovered)}
        data-component-id={rootPanel.id}
        onPointerEnter={isInteractive ? handlePointerEnter : undefined}
        onPointerLeave={isInteractive ? handlePointerLeave : undefined}
        onClick={isInteractive ? handleClick : undefined}
      />

      <StitchLines componentId={rootPanel.id} />

      {computedRootPanel.children.map((component) => {
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
