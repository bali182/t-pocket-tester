import { useMemo } from 'react'

import type { StitchLineSchema } from '../schemas/stitching'
import { useProject } from './useProject'

export const useStitchLines = (componentId: string): StitchLineSchema[] => {
  const { project } = useProject()

  return useMemo(
    () => project.stitchLines.filter((stitchLine) => stitchLine.componentId === componentId),
    [componentId, project.stitchLines],
  )
}
