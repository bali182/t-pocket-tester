import type { FC } from 'react'

import { useProject } from '../../hooks/useProject'
import { useSubProject } from '../../hooks/useSubProject'
import { getResolvedStitchLine } from '../../utils/getResolvedStitchLine'
import { isDefined } from '../../utils/isDefined'
import { StitchLine } from './StitchLine'

type StitchLinesProps = {
  componentId: string
}

export const StitchLines: FC<StitchLinesProps> = ({ componentId }) => {
  const { project } = useProject()
  const { subProject, computedSubProject } = useSubProject()
  const stitchLines = subProject.stitchLines.filter((stitchLine) => stitchLine.type === 'component-bounds-stitch-line')

  return (
    <>
      {stitchLines.map((stitchLine) => {
        const computedStitchLine = computedSubProject.stitchLines.find(
          (computedStitchLine) => computedStitchLine.stitchLineId === stitchLine.id,
        )

        if (!isDefined(computedStitchLine)) {
          throw new Error(`Computed stitch line not found: ${stitchLine.id}`)
        }

        if (computedStitchLine.componentId !== componentId) {
          return null
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
