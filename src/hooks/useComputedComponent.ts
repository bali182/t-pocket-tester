import type { ComputedComponentSchema } from '../schemas/computed'
import { isDefined } from '../utils/isDefined'
import { useProject } from './useProject'

export const useComputedComponent = <T extends ComputedComponentSchema = ComputedComponentSchema>(id: string): T => {
  const { computedProject } = useProject()
  const computedComponent = computedProject.components[id]

  if (!isDefined(computedComponent)) {
    throw new Error(`Computed component not found: ${id}`)
  }

  return computedComponent as T
}
