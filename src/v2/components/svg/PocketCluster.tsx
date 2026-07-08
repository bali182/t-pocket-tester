import { useCallback, useState, type FC, type MouseEventHandler, type PointerEventHandler } from 'react'

import { STROKE_THICKNESS } from '../../constants/drawing'
import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { useComponent } from '../../hooks/useComponent'
import { useComputedComponent } from '../../hooks/useComputedComponent'
import { usePath } from '../../hooks/usePath'
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
  const pathData = usePath(computedPocketCluster.path)
  const frontPocketPathData = usePath(computedPocketCluster.frontPocket.path)
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
        <path
          {...svgStyles.element}
          d={pathData}
          strokeWidth={STROKE_THICKNESS}
        />
      )}
      {computedPocketCluster.tPockets.map((pocket) => (
        <TPocket {...svgStyles.child} key={pocket.id} path={pocket.path} strokeWidth={STROKE_THICKNESS} />
      ))}

      <path
        {...svgStyles.child}
        d={frontPocketPathData}
        strokeWidth={STROKE_THICKNESS}
      />
    </g>
  )
}
