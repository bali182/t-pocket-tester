import type { ComputedProjectSchema, ProjectSchema } from '../schemas/project'
import { isDefined } from '../utils/isDefined'

export const deleteOrphanedHoles = (project: ProjectSchema, _computedProject: ComputedProjectSchema): ProjectSchema => {
  const holes = project.holes.filter((hole) => isDefined(project.components[hole.componentId]))

  if (holes.length === project.holes.length) {
    return project
  }

  return {
    ...project,
    holes,
  }
}
