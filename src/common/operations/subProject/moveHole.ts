import { HoleSchema } from '../../schemas/hole'
import type { SubProjectSchema } from '../../schemas/subProject'
import { isDefined } from '../../utils/isDefined'

export type MoveHoleParams = {
  holeId: string
  targetComponentId: string
}

export const moveHole = (
  subProject: SubProjectSchema,
  { holeId, targetComponentId }: MoveHoleParams,
): SubProjectSchema => {
  const hole = subProject.holes.find((candidate) => candidate.id === holeId)

  if (
    !isDefined(hole) ||
    !isDefined(subProject.components[targetComponentId]) ||
    hole.componentId === targetComponentId
  ) {
    return subProject
  }

  const newHole: HoleSchema = { ...hole, componentId: targetComponentId }

  return {
    ...subProject,
    holes: subProject.holes.map((candidate) => (candidate.id === holeId ? newHole : candidate)),
  }
}
