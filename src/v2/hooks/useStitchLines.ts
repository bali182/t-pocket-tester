import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import type { ProjectStitchLineSchema } from '../schemas/stitching'
import { projectAtom } from '../state'

export const useStitchLines = (componentId: string): ProjectStitchLineSchema[] => {
  const project = useAtomValue(projectAtom)

  return useMemo(
    () => project.stitchLines.filter((stitchLine) => stitchLine.componentId === componentId),
    [componentId, project.stitchLines],
  )
}
