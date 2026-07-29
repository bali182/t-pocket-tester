import type { FC } from 'react'

import { useProject } from '../../hooks/useProject'
import { getResolvedStitchLine } from '../../utils/getResolvedStitchLine'
import { isDefined } from '../../utils/isDefined'
import { StitchLine } from './StitchLine'

type StitchLinesProps = {
  componentId: string
}

export const StitchLines: FC<StitchLinesProps> = ({ componentId }) => {
  const { project, computedProject } = useProject()
  const stitchLines = project.stitchLines.filter((stitchLine) => {
    if (stitchLine.type !== 'component-bounds-stitch-line') {
      return false
    }
    if (stitchLine.targetType === 'hole') {
      throw new Error('Hole stitch line targets are not supported yet')
    }

    return stitchLine.targetId === componentId
  })

  return (
    <>
      {stitchLines.map((stitchLine) => {
        const computedStitchLine = computedProject.stitchLines.find(
          (computedStitchLine) => computedStitchLine.stitchLineId === stitchLine.id,
        )

        if (!isDefined(computedStitchLine)) {
          throw new Error(`Computed stitch line not found: ${stitchLine.id}`)
        }

        const resolvedStitchLine = getResolvedStitchLine(stitchLine, project.stitchingSettings)

        return (
          <StitchLine
            computedStitchLine={computedStitchLine}
            key={stitchLine.id}
            stitchHoleLength={resolvedStitchLine.stitchHoleLength}
            stitchLine={stitchLine}
          />
        )
      })}
    </>
  )
}
