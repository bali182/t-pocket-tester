import { useMemo } from 'react'

import type { StitchLineSchema } from '../schemas/stitching'
import { isDefined } from '../utils/isDefined'
import { useSubProject } from './useSubProject'

export const useStitchLines = (componentId: string): StitchLineSchema[] => {
  const { subProject } = useSubProject()

  return useMemo(
    () =>
      subProject.stitchLines.filter((stitchLine) => {
        if (stitchLine.targetType === 'component') {
          return stitchLine.targetId === componentId
        }

        const targetHole = subProject.holes.find((hole) => hole.id === stitchLine.targetId)

        return isDefined(targetHole) && targetHole.componentId === componentId
      }),
    [componentId, subProject.holes, subProject.stitchLines],
  )
}
