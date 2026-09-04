import { StitchLineSchema } from '../../schemas/stitching'
import { SubProjectSchema } from '../../schemas/subProject'

export type AddStitchLineParams = {
  stitchLine: StitchLineSchema
}

export const addStitchLine = (subProject: SubProjectSchema, params: AddStitchLineParams): SubProjectSchema => {
  return {
    ...subProject,
    stitchLines: [...subProject.stitchLines, params.stitchLine],
  }
}
