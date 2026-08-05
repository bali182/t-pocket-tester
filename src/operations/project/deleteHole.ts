import type { ProjectSchema } from '../../schemas/project'

export type DeleteHoleParams = {
  holeId: string
}

export const deleteHole = (project: ProjectSchema, { holeId }: DeleteHoleParams): ProjectSchema => {
  return {
    ...project,
    holes: project.holes.filter((hole) => hole.id !== holeId),
  }
}
