import { HoleSchema } from '../../schemas/hole'
import { SubProjectSchema } from '../../schemas/subProject'

export type UpdateHoleParams = {
  hole: HoleSchema
}

export const updateHole = (subProject: SubProjectSchema, { hole }: UpdateHoleParams): SubProjectSchema => {
  return {
    ...subProject,
    holes: subProject.holes.map((candidate) => (candidate.id === hole.id ? hole : candidate)),
  }
}
