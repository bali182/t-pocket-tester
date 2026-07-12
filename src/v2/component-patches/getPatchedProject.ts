import type { ComputedProjectSchema, ProjectSchema } from '../schemas/project'
import { addComputedSizes } from './addComputedSizes'
import { adjustCornerRadiiToParent } from './adjustCornerRadiiToParent'

type PatcherFunctionSchema = (project: ProjectSchema, computedProject: ComputedProjectSchema) => ProjectSchema

const patchers: PatcherFunctionSchema[] = [addComputedSizes, adjustCornerRadiiToParent]

export const getPatchedProject = (project: ProjectSchema, computedProject: ComputedProjectSchema): ProjectSchema => {
  return patchers.reduce((project, patcher) => patcher(project, computedProject), project)
}
