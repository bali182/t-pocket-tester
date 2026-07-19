import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import type { StitchLineSchema } from '../schemas/stitching'
import { projectAtom } from '../state/projectAtom'

export const useStitchLines = (componentId: string): StitchLineSchema[] => {
  const project = useAtomValue(projectAtom)

  return useMemo(
    () => project.stitchLines.filter((stitchLine) => stitchLine.componentId === componentId),
    [componentId, project.stitchLines],
  )
}
