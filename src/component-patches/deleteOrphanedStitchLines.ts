import type { ComputedProjectSchema, ProjectSchema } from '../schemas/project'
import { isDefined } from '../utils/isDefined'

export const deleteOrphanedStitchLines = (
  project: ProjectSchema,
  _computedProject: ComputedProjectSchema,
): ProjectSchema => {
  const stitchLines = project.stitchLines.filter((stitchLine) => {
    if (stitchLine.targetType === 'hole') {
      return project.holes.some((hole) => hole.id === stitchLine.targetId)
    }

    return isDefined(project.components[stitchLine.targetId])
  })

  if (stitchLines.length === project.stitchLines.length) {
    return project
  }

  return {
    ...project,
    stitchLines,
  }
}
