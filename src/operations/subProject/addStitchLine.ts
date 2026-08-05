import { SubProjectSchema } from '../../schemas/subProject'
import { StitchLineSchema } from '../../schemas/stitching'

export type AddStitchLineParams = {
  stitchLine: StitchLineSchema
}

export const addStitchLine = (subProject: SubProjectSchema, params: AddStitchLineParams): SubProjectSchema => {
  return {
    ...subProject,
    stitchLines: [...subProject.stitchLines, params.stitchLine],
  }
}
