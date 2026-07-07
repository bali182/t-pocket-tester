import { useCallback, useState, type FC, type MouseEventHandler, type PointerEventHandler } from 'react'

import { STROKE_THICKNESS } from '../../constants/drawing'
import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { useComponent } from '../../hooks/useComponent'
import { useComputedComponent } from '../../hooks/useComputedComponent'
import type { PocketClusterSchema } from '../../schemas/components'
import type { ComputedPocketClusterSchema } from '../../schemas/computed'
import { TPocket } from './TPocket'
import { useSvgElementStyle } from './useSvgElementStyle'

type PocketClusterProps = {
  componentId: string
}

export const PocketCluster: FC<PocketClusterProps> = ({ componentId }) => {
  const { isInteractive, onComponentClick } = useDrawAreaContext()
  const [isHovered, setIsHovered] = useState(false)
  const pocketCluster = useComponent<PocketClusterSchema>(componentId)
  const computedPocketCluster = useComputedComponent<ComputedPocketClusterSchema>(componentId)
  const svgStyles = useSvgElementStyle(pocketCluster, isHovered)

  const handlePointerEnter = useCallback<PointerEventHandler<SVGGElement>>(() => {
    setIsHovered(true)
  }, [])
  const handlePointerLeave = useCallback<PointerEventHandler<SVGGElement>>(() => {
    setIsHovered(false)
  }, [])
  const handleClick = useCallback<MouseEventHandler<SVGGElement>>(
    (event) => {
      event.stopPropagation()
      onComponentClick(pocketCluster, event.currentTarget)
    },
    [onComponentClick, pocketCluster],
  )

  return (
    <g
      data-component-id={pocketCluster.id}
      onClick={isInteractive ? handleClick : undefined}
      onPointerEnter={isInteractive ? handlePointerEnter : undefined}
      onPointerLeave={isInteractive ? handlePointerLeave : undefined}
    >
      {svgStyles.isSelected && (
        <rect
          {...svgStyles.element}
          height={computedPocketCluster.boundingRect.height}
          strokeWidth={STROKE_THICKNESS}
          width={computedPocketCluster.boundingRect.width}
          x={computedPocketCluster.boundingRect.x}
          y={computedPocketCluster.boundingRect.y}
        />
      )}
      {computedPocketCluster.tPockets.map((polygon, index) => (
        <TPocket {...svgStyles.child} key={index} points={polygon.points} strokeWidth={STROKE_THICKNESS} />
      ))}

      <rect
        {...svgStyles.child}
        height={computedPocketCluster.frontPocket.height}
        strokeWidth={STROKE_THICKNESS}
        width={computedPocketCluster.frontPocket.width}
        x={computedPocketCluster.frontPocket.x}
        y={computedPocketCluster.frontPocket.y}
      />
    </g>
  )
}
