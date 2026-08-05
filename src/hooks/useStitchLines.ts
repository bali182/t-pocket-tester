import { useMemo } from 'react'

import type { StitchLineSchema } from '../schemas/stitching'
import { isDefined } from '../utils/isDefined'
import { useProject } from './useProject'

export const useStitchLines = (componentId: string): StitchLineSchema[] => {
  const { project } = useProject()

  return useMemo(
    () =>
      project.stitchLines.filter((stitchLine) => {
        if (stitchLine.targetType === 'component') {
          return stitchLine.targetId === componentId
        }

        const targetHole = project.holes.find((hole) => hole.id === stitchLine.targetId)

        return isDefined(targetHole) && targetHole.componentId === componentId
      }),
    [componentId, project.holes, project.stitchLines],
  )
}
