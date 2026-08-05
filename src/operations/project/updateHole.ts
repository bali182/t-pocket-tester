import { HoleSchema } from '../../schemas/hole'
import { ProjectSchema } from '../../schemas/project'

export type UpdateHoleParams = {
  hole: HoleSchema
}

export const updateHole = (project: ProjectSchema, { hole }: UpdateHoleParams): ProjectSchema => {
  return {
    ...project,
    holes: project.holes.map((candidate) => (candidate.id === hole.id ? hole : candidate)),
  }
}
