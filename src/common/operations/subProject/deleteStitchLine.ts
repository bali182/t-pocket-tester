import { SubProjectSchema } from '../../schemas/subProject'

export type DeleteStitchLineParams = {
  stitchLineId: string
}

export const deleteStitchLine = (
  subProject: SubProjectSchema,
  { stitchLineId }: DeleteStitchLineParams,
): SubProjectSchema => {
  return {
    ...subProject,
    stitchLines: subProject.stitchLines.filter((stitchLine) => stitchLine.id !== stitchLineId),
  }
}
