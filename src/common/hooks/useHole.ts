import type { HoleSchema } from '../schemas/hole'
import { isDefined } from '../utils/isDefined'
import { useSubProject } from './useSubProject'

export const useHole = (id: string): HoleSchema => {
  const { subProject } = useSubProject()
  const hole = subProject.holes.find((candidate) => candidate.id === id)

  if (!isDefined(hole)) {
    throw new Error(`Hole not found: ${id}`)
  }

  return hole
}
