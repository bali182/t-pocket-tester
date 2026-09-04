import type { StitchLineSchema } from '../schemas/stitching'
import { isDefined } from '../utils/isDefined'
import { useSubProject } from './useSubProject'

export const useStitchLine = (id: string): StitchLineSchema => {
  const { subProject } = useSubProject()
  const stitchLine = subProject.stitchLines.find((candidate) => candidate.id === id)

  if (!isDefined(stitchLine)) {
    throw new Error(`Stitch line not found: ${id}`)
  }

  return stitchLine
}
