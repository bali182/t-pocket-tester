import { HoleSchema } from '../../schemas/hole'
import type { ProjectSchema } from '../../schemas/project'
import { isDefined } from '../../utils/isDefined'

export type MoveHoleParams = {
  holeId: string
  targetComponentId: string
}

export const moveHole = (project: ProjectSchema, { holeId, targetComponentId }: MoveHoleParams): ProjectSchema => {
  const hole = project.holes.find((candidate) => candidate.id === holeId)

  if (!isDefined(hole) || !isDefined(project.components[targetComponentId]) || hole.componentId === targetComponentId) {
    return project
  }

  const newHole: HoleSchema = { ...hole, componentId: targetComponentId }

  return {
    ...project,
    holes: project.holes.map((candidate) => (candidate.id === holeId ? newHole : candidate)),
  }
}
