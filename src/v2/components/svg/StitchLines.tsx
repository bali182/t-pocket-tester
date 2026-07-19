import type { FC } from 'react'

import { useProject } from '../../hooks/useProject'
import { isDefined } from '../../utils/isDefined'
import { StitchLine } from './StitchLine'

type StitchLinesProps = {
  componentId: string
}

export const StitchLines: FC<StitchLinesProps> = ({ componentId }) => {
  const { project, computedProject } = useProject()
  const stitchLines = project.stitchLines.filter(
    (stitchLine) => stitchLine.componentId === componentId && stitchLine.type === 'component-bounds-stitch-line',
  )

  return (
    <>
      {stitchLines.map((stitchLine) => {
        const computedStitchLine = computedProject.stitchLines.find(
          (computedStitchLine) => computedStitchLine.stitchLineId === stitchLine.id,
        )

        if (!isDefined(computedStitchLine)) {
          throw new Error(`Computed stitch line not found: ${stitchLine.id}`)
        }

        return <StitchLine key={stitchLine.id} stitchLine={stitchLine} computedStitchLine={computedStitchLine} />
      })}
    </>
  )
}
