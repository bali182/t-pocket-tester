import { ProjectSchema } from '../../schemas/project'
import { StitchLineSchema } from '../../schemas/stitching'

export type UpdateStitchLineParams = {
  stitchLine: StitchLineSchema
}

export const updateStitchLine = (project: ProjectSchema, { stitchLine }: UpdateStitchLineParams): ProjectSchema => {
  return {
    ...project,
    stitchLines: project.stitchLines.map((s) => (s.id === stitchLine.id ? stitchLine : s)),
  }
}
