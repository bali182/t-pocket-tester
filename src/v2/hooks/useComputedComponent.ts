import { useAtomValue } from 'jotai'

import type { ComputedComponentSchema } from '../schemas/computed2'
import { computedProjectAtom } from '../state'
import { isDefined } from '../utils/isDefined'

export const useComputedComponent = <T extends ComputedComponentSchema = ComputedComponentSchema>(id: string): T => {
  const computedProject = useAtomValue(computedProjectAtom)
  const computedComponent = computedProject.components[id]

  if (!isDefined(computedComponent)) {
    throw new Error(`Computed component not found: ${id}`)
  }

  return computedComponent as T
}
