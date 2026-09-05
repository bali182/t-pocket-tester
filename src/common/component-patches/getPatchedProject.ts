import { getComputedSubProject } from '../logic/getComputedSubProject'
import type { ProjectSchema } from '../schemas/project'
import type { SubProjectSchema } from '../schemas/subProject'
import { getPatchedSubProject } from './getPatchedSubProject'

export const getPatchedProject = (project: ProjectSchema): ProjectSchema => {
  const subProjects: SubProjectSchema[] = []

  for (const subProject of project.subProjects) {
    const computedSubProject = getComputedSubProject(subProject, project.stitchingSettings)
    subProjects.push(getPatchedSubProject(subProject, computedSubProject))
  }

  return {
    ...project,
    subProjects,
  }
}
