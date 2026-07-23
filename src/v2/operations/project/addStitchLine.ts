import { ProjectSchema } from '../../schemas/project'
import { StitchLineSchema } from '../../schemas/stitching'

export type AddStitchLineParams = {
  stitchLine: StitchLineSchema
}

export const addStitchLine = (project: ProjectSchema, params: AddStitchLineParams): ProjectSchema => {
  return {
    ...project,
    stitchLines: [...project.stitchLines, params.stitchLine],
  }
}
