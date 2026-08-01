import type { HoleSchema } from '../../schemas/hole'
import type { ProjectSchema } from '../../schemas/project'

export type AddHoleParams = {
  hole: HoleSchema
}

export const addHole = (project: ProjectSchema, params: AddHoleParams): ProjectSchema => {
  return {
    ...project,
    holes: [...project.holes, params.hole],
  }
}
