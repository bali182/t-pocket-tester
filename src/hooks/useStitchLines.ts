import { useMemo } from 'react'

import type { StitchLineSchema } from '../schemas/stitching'
import { useProject } from './useProject'

export const useStitchLines = (componentId: string): StitchLineSchema[] => {
  const { project } = useProject()

  return useMemo(
    () =>
      project.stitchLines.filter((stitchLine) => {
        if (stitchLine.targetType === 'hole') {
          throw new Error('Hole stitch line targets are not supported yet')
        }

        return stitchLine.targetId === componentId
      }),
    [componentId, project.stitchLines],
  )
}
