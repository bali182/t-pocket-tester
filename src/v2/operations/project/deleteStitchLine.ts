import { ProjectSchema } from '../../schemas/project'

export type DeleteStitchLineParams = {
  stitchLineId: string
}

export const deleteStitchLine = (project: ProjectSchema, { stitchLineId }: DeleteStitchLineParams): ProjectSchema => {
  return {
    ...project,
    stitchLines: project.stitchLines.filter((stitchLine) => stitchLine.id !== stitchLineId),
  }
}
