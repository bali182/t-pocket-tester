import { useCallback, useState, type FC, type MouseEventHandler, type PointerEventHandler } from 'react'

import { useDrawAreaContext, type DrawAreaHoleStyleParams } from '../../contexts/DrawAreaContext'
import { usePath } from '../../hooks/usePath'
import { useSubProject } from '../../hooks/useSubProject'
import type { ComputedHoleSchema } from '../../schemas/computed'
import type { HoleSchema } from '../../schemas/hole'
import { isDefined } from '../../utils/isDefined'

type HoleHighlightsProps = {
  componentId: string
}

type HoleHighlightProps = {
  computedHole: ComputedHoleSchema
  hole: HoleSchema
}

export const HoleHighlights: FC<HoleHighlightsProps> = ({ componentId }) => {
  const { computedSubProject: computedProject, subProject } = useSubProject()
  const holes = subProject.holes.filter((hole) => hole.componentId === componentId)

  return (
    <>
      {holes.map((hole) => {
        const computedHole = computedProject.holes.find((candidate) => candidate.holeId === hole.id)

        if (!isDefined(computedHole)) {
          throw new Error(`Computed hole not found: ${hole.id}`)
        }

        return <HoleHighlight computedHole={computedHole} hole={hole} key={hole.id} />
      })}
    </>
  )
}

const HoleHighlight: FC<HoleHighlightProps> = ({ computedHole, hole }) => {
  const { holeStyles, isInteractive, selection } = useDrawAreaContext()
  const [isHovered, setIsHovered] = useState(false)
  const pathData = usePath(computedHole.highlightPath)
  const styleParams: DrawAreaHoleStyleParams = { hole, isHovered }

  const handlePointerEnter = useCallback<PointerEventHandler<SVGPathElement>>(() => {
    setIsHovered(true)
  }, [])

  const handlePointerLeave = useCallback<PointerEventHandler<SVGPathElement>>(() => {
    setIsHovered(false)
  }, [])

  const handleClick = useCallback<MouseEventHandler<SVGPathElement>>(
    (event) => {
      event.stopPropagation()
      selection.selectHole(hole.id)
    },
    [hole.id, selection],
  )

  return (
    <path
      cursor={isInteractive ? 'pointer' : undefined}
      d={pathData}
      data-hole-id={hole.id}
      fill={holeStyles.getFillColor(styleParams)}
      onClick={isInteractive ? handleClick : undefined}
      onPointerEnter={isInteractive ? handlePointerEnter : undefined}
      onPointerLeave={isInteractive ? handlePointerLeave : undefined}
      pointerEvents={isInteractive ? 'fill' : 'none'}
      stroke={holeStyles.getStrokeColor(styleParams)}
      strokeWidth={holeStyles.getStrokeThickness(styleParams)}
    />
  )
}
