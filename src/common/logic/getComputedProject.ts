import type { ComputedProjectSchema, ProjectSchema } from '../schemas/project'
import type { ComputedSubProjectSchema, SubProjectSchema } from '../schemas/subProject'
import { getComputedSubProject } from './getComputedSubProject'

export const getComputedProject = (project: ProjectSchema): ComputedProjectSchema => {
  return {
    id: project.id,
    name: project.name,
    subProjects: project.subProjects.map(
      (subProject: SubProjectSchema): ComputedSubProjectSchema =>
        getComputedSubProject(subProject, project.stitchingSettings),
    ),
  }
}
