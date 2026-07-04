import { useCallback, useMemo, useState, type FC, type MouseEventHandler, type PointerEventHandler } from 'react'

import { STROKE_COLOR, STROKE_THICKNESS } from '../../constants/drawing'
import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { calculatePocketClusterGeometry } from '../../logic/calculatePocketClusterGeometry'
import type { PocketClusterSchema } from '../../schemas/components'
import type { RectSchema } from '../../schemas/geometry'
import { TPocket } from './TPocket'

type PocketClusterProps = {
  pocketCluster: PocketClusterSchema
  rect: RectSchema
}

export const PocketCluster: FC<PocketClusterProps> = ({ pocketCluster, rect }) => {
  const { getHoverBackgroundColor, isInteractive, onComponentClick } = useDrawAreaContext()
  const [isHovered, setIsHovered] = useState(false)
  const geometry = useMemo(() => calculatePocketClusterGeometry(pocketCluster, rect), [pocketCluster, rect])
  const fill = isHovered && isInteractive ? getHoverBackgroundColor(pocketCluster) : pocketCluster.color
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
      {geometry.tPocketPolygons.map((points, index) => (
        <TPocket
          key={index}
          fill={fill}
          points={points}
          stroke={STROKE_COLOR}
          strokeWidth={STROKE_THICKNESS}
        />
      ))}

      <rect
        fill={fill}
        height={geometry.topPocketRect.height}
        stroke={STROKE_COLOR}
        strokeWidth={STROKE_THICKNESS}
        width={geometry.topPocketRect.width}
        x={geometry.topPocketRect.x}
        y={geometry.topPocketRect.y}
      />
    </g>
  )
}
