import type { HoleSchema } from '../../schemas/hole'
import type { ProjectSchema } from '../../schemas/project'

export type CloneHoleParams = {
  holeId: string
  getUnusedId: () => string
  getUnusedName: (sourceName: string, usedNames: Set<string>) => string
}

export const cloneHole = (
  project: ProjectSchema,
  { holeId, getUnusedId, getUnusedName }: CloneHoleParams,
): ProjectSchema => {
  const sourceHoleIndex = project.holes.findIndex((hole) => hole.id === holeId)

  if (sourceHoleIndex < 0) {
    return project
  }

  const sourceHole = project.holes[sourceHoleIndex]
  const usedNames = new Set(project.holes.map((hole) => hole.name))
  const clonedHole: HoleSchema = {
    ...sourceHole,
    id: getUnusedId(),
    name: getUnusedName(sourceHole.name, usedNames),
  }

  return {
    ...project,
    holes: [...project.holes.slice(0, sourceHoleIndex + 1), clonedHole, ...project.holes.slice(sourceHoleIndex + 1)],
  }
}
