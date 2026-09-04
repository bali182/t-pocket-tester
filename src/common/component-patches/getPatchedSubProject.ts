import type { ProjectEditingSettingSchema } from '../schemas/settings'
import type { ComputedSubProjectSchema, SubProjectSchema } from '../schemas/subProject'
import { addAutoStitchLineRadii } from './addAutoStitchLineRadii'
import { addComputedSizes } from './addComputedSizes'
import { adjustStitchLines } from './adjustStitchLines'
import { deleteOrphanedHoles } from './deleteOrphanedHoles'
import { deleteOrphanedStitchLines } from './deleteOrphanedStitchLines'

type PatcherFunctionSchema = (
  subProject: SubProjectSchema,
  computedSubProject: ComputedSubProjectSchema,
  editingSettings: ProjectEditingSettingSchema,
) => SubProjectSchema

const patchers: PatcherFunctionSchema[] = [
  addComputedSizes,
  deleteOrphanedHoles,
  deleteOrphanedStitchLines,
  adjustStitchLines,
  addAutoStitchLineRadii,
]

export const getPatchedSubProject = (
  subProject: SubProjectSchema,
  computedSubProject: ComputedSubProjectSchema,
  editingSettings: ProjectEditingSettingSchema,
): SubProjectSchema => {
  return patchers.reduce((subProject, patcher) => patcher(subProject, computedSubProject, editingSettings), subProject)
}
