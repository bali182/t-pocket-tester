import type { SubProjectSchema } from '../../schemas/subProject'

export type DeleteHoleParams = {
  holeId: string
}

export const deleteHole = (subProject: SubProjectSchema, { holeId }: DeleteHoleParams): SubProjectSchema => {
  return {
    ...subProject,
    holes: subProject.holes.filter((hole) => hole.id !== holeId),
  }
}
