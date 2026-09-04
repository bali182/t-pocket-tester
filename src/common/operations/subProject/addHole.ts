import type { HoleSchema } from '../../schemas/hole'
import type { SubProjectSchema } from '../../schemas/subProject'

export type AddHoleParams = {
  hole: HoleSchema
}

export const addHole = (subProject: SubProjectSchema, params: AddHoleParams): SubProjectSchema => {
  return {
    ...subProject,
    holes: [...subProject.holes, params.hole],
  }
}
