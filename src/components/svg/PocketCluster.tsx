import { Fragment, useCallback, useState, type FC, type MouseEventHandler, type PointerEventHandler } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { useComponent } from '../../hooks/useComponent'
import { useComputedComponent } from '../../hooks/useComputedComponent'
import { usePath } from '../../hooks/usePath'
import type { PocketClusterSchema } from '../../schemas/components'
import type { ComputedPocketClusterSchema } from '../../schemas/computed'
import { isDefined } from '../../utils/isDefined'
import { Card } from './Card'
import { HoleHighlights } from './HoleHighlights'
import { StitchLines } from './StitchLines'
import { TPocket } from './TPocket'
import { TPocketStitchLines } from './TPocketStitchLines'

type PocketClusterProps = {
  componentId: string
  nestingLevel: number
}

export const PocketCluster: FC<PocketClusterProps> = ({ componentId, nestingLevel }) => {
  const { componentStyles, isInteractive, isShowingCards, selection } = useDrawAreaContext()
  const [isHovered, setIsHovered] = useState(false)
  const pocketCluster = useComponent<PocketClusterSchema>(componentId)
  const computedPocketCluster = useComputedComponent<ComputedPocketClusterSchema>(componentId)
  const pathData = usePath(computedPocketCluster.path)
  const frontPocketPathData = usePath(computedPocketCluster.frontPocket.path)
  const isSelected = selection.isComponentSelected(pocketCluster.id) || isHovered

  const handlePointerEnter = useCallback<PointerEventHandler<SVGGElement>>(() => {
    setIsHovered(true)
  }, [])
  const handlePointerLeave = useCallback<PointerEventHandler<SVGGElement>>(() => {
    setIsHovered(false)
  }, [])
  const handleClick = useCallback<MouseEventHandler<SVGGElement>>(
    (event) => {
      event.stopPropagation()
      selection.selectComponent(pocketCluster.id)
    },
    [pocketCluster.id, selection],
  )

  return (
    <>
      <g
        data-component-id={pocketCluster.id}
        onClick={isInteractive ? handleClick : undefined}
        onPointerEnter={isInteractive ? handlePointerEnter : undefined}
        onPointerLeave={isInteractive ? handlePointerLeave : undefined}
      >
        {isSelected && (
          <path
            d={pathData}
            fill={componentStyles.getBackgroundColor(pocketCluster, nestingLevel, isHovered)}
            filter={componentStyles.getFilter(pocketCluster, isHovered)}
            stroke={componentStyles.getBorderColor(pocketCluster, isHovered)}
            strokeWidth={componentStyles.getBorderThickness(pocketCluster, isHovered)}
          />
        )}
        {computedPocketCluster.tPockets.map((pocket, pocketIndex) => (
          <Fragment key={pocket.id}>
            {isShowingCards && isDefined(pocket.card) && (
              <Card isParentHovered={isHovered} owner={pocketCluster} path={pocket.card.path} />
            )}
            <TPocket
              fill={componentStyles.getBackgroundColor(pocketCluster, nestingLevel, isHovered)}
              path={pocket.path}
              stroke={componentStyles.getBorderColor(pocketCluster, isHovered)}
              strokeWidth={componentStyles.getBorderThickness(pocketCluster, isHovered)}
            />
            <TPocketStitchLines componentId={pocketCluster.id} pocketIndex={pocketIndex} />
          </Fragment>
        ))}

        {isShowingCards && isDefined(computedPocketCluster.frontPocket.card) && (
          <Card isParentHovered={isHovered} owner={pocketCluster} path={computedPocketCluster.frontPocket.card.path} />
        )}
        <path
          d={frontPocketPathData}
          fill={componentStyles.getBackgroundColor(pocketCluster, nestingLevel, isHovered)}
          stroke={componentStyles.getBorderColor(pocketCluster, isHovered)}
          strokeWidth={componentStyles.getBorderThickness(pocketCluster, isHovered)}
        />
      </g>
      <StitchLines componentId={pocketCluster.id} />
      <HoleHighlights componentId={pocketCluster.id} />
    </>
  )
}
