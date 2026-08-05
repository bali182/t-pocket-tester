import type { HoleSchema } from '../schemas/hole'
import { isDefined } from '../utils/isDefined'
import { useProject } from './useProject'

export const useHole = (id: string): HoleSchema => {
  const { project } = useProject()
  const hole = project.holes.find((candidate) => candidate.id === id)

  if (!isDefined(hole)) {
    throw new Error(`Hole not found: ${id}`)
  }

  return hole
}
