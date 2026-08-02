import type { ComputedProjectSchema, ProjectSchema } from '../schemas/project'
import { addComputedSizes } from './addComputedSizes'
import { adjustCornerRadiiToParent } from './adjustCornerRadiiToParent'
import { adjustStitchLines } from './adjustStitchLines'
import { deleteOrphanedHoles } from './deleteOrphanedHoles'
import { deleteOrphanedStitchLines } from './deleteOrphanedStitchLines'

type PatcherFunctionSchema = (project: ProjectSchema, computedProject: ComputedProjectSchema) => ProjectSchema

const patchers: PatcherFunctionSchema[] = [
  addComputedSizes,
  adjustCornerRadiiToParent,
  deleteOrphanedHoles,
  deleteOrphanedStitchLines,
  adjustStitchLines,
]

export const getPatchedProject = (project: ProjectSchema, computedProject: ComputedProjectSchema): ProjectSchema => {
  return patchers.reduce((project, patcher) => patcher(project, computedProject), project)
}
