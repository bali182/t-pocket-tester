import type { ProjectSchema } from '../schemas/project'

export const removeStitchLine = (id: string, project: ProjectSchema): ProjectSchema => {
  return {
    ...project,
    stitchLines: project.stitchLines.filter((stitchLine) => stitchLine.id !== id),
  }
}
