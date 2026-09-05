import type { ProjectSchema } from '../schemas/project'

export const needsFullProjectPatch = (oldProject: ProjectSchema, updatedProject: ProjectSchema): boolean => {
  // Auto corner radii are persisted by addAutoStitchLineRadii and derive from stitchMargin.
  // A changed margin requires updating every subproject's cached values.
  return oldProject.stitchingSettings.stitchMargin !== updatedProject.stitchingSettings.stitchMargin
}
