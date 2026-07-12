import type { ComputedProjectSchema, ProjectSchema } from '../schemas/project'

export const getPatchedProject = (project: ProjectSchema, _computedProject: ComputedProjectSchema): ProjectSchema => {
  return project
}
