import type { ComputedSubProjectSchema, SubProjectSchema } from '../schemas/subProject'
import { addComputedSizes } from './addComputedSizes'
import { adjustCornerRadiiToParent } from './adjustCornerRadiiToParent'
import { adjustStitchLines } from './adjustStitchLines'
import { deleteOrphanedHoles } from './deleteOrphanedHoles'
import { deleteOrphanedStitchLines } from './deleteOrphanedStitchLines'

type PatcherFunctionSchema = (
  subProject: SubProjectSchema,
  computedSubProject: ComputedSubProjectSchema,
) => SubProjectSchema

const patchers: PatcherFunctionSchema[] = [
  addComputedSizes,
  adjustCornerRadiiToParent,
  deleteOrphanedHoles,
  deleteOrphanedStitchLines,
  adjustStitchLines,
]

export const getPatchedSubProject = (
  subProject: SubProjectSchema,
  computedSubProject: ComputedSubProjectSchema,
): SubProjectSchema => {
  return patchers.reduce((subProject, patcher) => patcher(subProject, computedSubProject), subProject)
}
