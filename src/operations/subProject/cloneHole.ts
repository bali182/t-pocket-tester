import type { HoleSchema } from '../../schemas/hole'
import type { SubProjectSchema } from '../../schemas/subProject'

export type CloneHoleParams = {
  holeId: string
  getUnusedId: () => string
  getUnusedName: (sourceName: string, usedNames: Set<string>) => string
}

export const cloneHole = (
  subProject: SubProjectSchema,
  { holeId, getUnusedId, getUnusedName }: CloneHoleParams,
): SubProjectSchema => {
  const sourceHoleIndex = subProject.holes.findIndex((hole) => hole.id === holeId)

  if (sourceHoleIndex < 0) {
    return subProject
  }

  const sourceHole = subProject.holes[sourceHoleIndex]
  const usedNames = new Set(subProject.holes.map((hole) => hole.name))
  const clonedHole: HoleSchema = {
    ...sourceHole,
    id: getUnusedId(),
    name: getUnusedName(sourceHole.name, usedNames),
  }

  return {
    ...subProject,
    holes: [
      ...subProject.holes.slice(0, sourceHoleIndex + 1),
      clonedHole,
      ...subProject.holes.slice(sourceHoleIndex + 1),
    ],
  }
}
