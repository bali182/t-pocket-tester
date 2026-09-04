import type { ComputedSubProjectSchema, SubProjectSchema } from '../schemas/subProject'
import { isDefined } from '../utils/isDefined'

export const deleteOrphanedStitchLines = (
  subProject: SubProjectSchema,
  _computedProject: ComputedSubProjectSchema,
): SubProjectSchema => {
  const stitchLines = subProject.stitchLines.filter((stitchLine) => {
    if (stitchLine.targetType === 'hole') {
      return subProject.holes.some((hole) => hole.id === stitchLine.targetId)
    }

    return isDefined(subProject.components[stitchLine.targetId])
  })

  if (stitchLines.length === subProject.stitchLines.length) {
    return subProject
  }

  return {
    ...subProject,
    stitchLines,
  }
}
