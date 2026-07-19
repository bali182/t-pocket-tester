import { useAtomValue } from 'jotai'

import type { StitchLineSchema } from '../schemas/stitching'
import { projectAtom } from '../state/projectAtom'
import { isDefined } from '../utils/isDefined'

export const useStitchLine = (id: string): StitchLineSchema => {
  const project = useAtomValue(projectAtom)
  const stitchLine = project.stitchLines.find((candidate) => candidate.id === id)

  if (!isDefined(stitchLine)) {
    throw new Error(`Stitch line not found: ${id}`)
  }

  return stitchLine
}
