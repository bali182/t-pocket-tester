import type { ComputedSubProjectSchema, SubProjectSchema } from '../schemas/subProject'
import { isDefined } from '../utils/isDefined'

export const deleteOrphanedHoles = (
  subProject: SubProjectSchema,
  _computedProject: ComputedSubProjectSchema,
): SubProjectSchema => {
  const holes = subProject.holes.filter((hole) => isDefined(subProject.components[hole.componentId]))

  if (holes.length === subProject.holes.length) {
    return subProject
  }

  return {
    ...subProject,
    holes,
  }
}
