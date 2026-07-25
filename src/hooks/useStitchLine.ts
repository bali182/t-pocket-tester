import type { StitchLineSchema } from '../schemas/stitching'
import { isDefined } from '../utils/isDefined'
import { useProject } from './useProject'

export const useStitchLine = (id: string): StitchLineSchema => {
  const { project } = useProject()
  const stitchLine = project.stitchLines.find((candidate) => candidate.id === id)

  if (!isDefined(stitchLine)) {
    throw new Error(`Stitch line not found: ${id}`)
  }

  return stitchLine
}
