import { StitchLineSchema } from '../../schemas/stitching'
import { SubProjectSchema } from '../../schemas/subProject'

export type UpdateStitchLineParams = {
  stitchLine: StitchLineSchema
}

export const updateStitchLine = (
  subProject: SubProjectSchema,
  { stitchLine }: UpdateStitchLineParams,
): SubProjectSchema => {
  return {
    ...subProject,
    stitchLines: subProject.stitchLines.map((s) => (s.id === stitchLine.id ? stitchLine : s)),
  }
}
