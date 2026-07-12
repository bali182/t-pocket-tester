import type { ComputedProjectSchema, ProjectSchema } from '../schemas/project'
import { addComputedSizes } from './addComputedSizes'

type PatcherFunctionSchema = (project: ProjectSchema, computedProject: ComputedProjectSchema) => ProjectSchema

const patchers: PatcherFunctionSchema[] = [addComputedSizes]

export const getPatchedProject = (project: ProjectSchema, computedProject: ComputedProjectSchema): ProjectSchema => {
  return patchers.reduce((project, patcher) => patcher(project, computedProject), project)
}
