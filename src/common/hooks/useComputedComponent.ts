import type { ComputedComponentSchema } from '../schemas/computed'
import { isDefined } from '../utils/isDefined'
import { useSubProject } from './useSubProject'

export const useComputedComponent = <T extends ComputedComponentSchema = ComputedComponentSchema>(id: string): T => {
  const { computedSubProject: computedProject } = useSubProject()
  const computedComponent = computedProject.components[id]

  if (!isDefined(computedComponent)) {
    throw new Error(`Computed component not found: ${id}`)
  }

  return computedComponent as T
}
