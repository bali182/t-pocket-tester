import type { FC } from 'react'

import { useProject } from '../../hooks/useProject'
import type { PocketClusterStitchLineSchema } from '../../schemas/stitching'
import { getResolvedStitchLine } from '../../utils/getResolvedStitchLine'
import { isDefined } from '../../utils/isDefined'
import { StitchLineRoute } from './StitchLineRoute'

type TPocketStitchLinesProps = {
  componentId: string
  pocketIndex: number
}

export const TPocketStitchLines: FC<TPocketStitchLinesProps> = ({ componentId, pocketIndex }) => {
  const { project, computedProject } = useProject()
  const stitchLines = project.stitchLines.filter(
    (stitchLine): stitchLine is PocketClusterStitchLineSchema =>
      stitchLine.componentId === componentId && stitchLine.type === 'pocket-cluster-stitch-line',
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

        const route = computedStitchLine.routes[pocketIndex]

        if (!isDefined(route)) {
          return null
        }

        const resolvedStitchLine = getResolvedStitchLine(stitchLine, project.stitchingSettings)

        return <StitchLineRoute key={stitchLine.id} route={route} settings={resolvedStitchLine} />
      })}
    </>
  )
}
