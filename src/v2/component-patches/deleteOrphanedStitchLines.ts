import type { ComputedProjectSchema, ProjectSchema } from '../schemas/project'
import { isDefined } from '../utils/isDefined'

export const deleteOrphanedStitchLines = (
  project: ProjectSchema,
  _computedProject: ComputedProjectSchema,
): ProjectSchema => {
  const stitchLines = project.stitchLines.filter((stitchLine) => isDefined(project.components[stitchLine.componentId]))

  if (stitchLines.length === project.stitchLines.length) {
    return project
  }

  return {
    ...project,
    stitchLines,
  }
}
