import { useAtomValue } from 'jotai'

import { computedProjectAtomFamily } from '../state/projectAtoms'
import { isDefined } from '../utils/isDefined'
import { useOptionalProject } from './useOptionalProject'

export const useComputedProject = () => {
  const { project } = useOptionalProject()
  const computedProject = useAtomValue(computedProjectAtomFamily(project?.id))

  if (!isDefined(project) || !isDefined(computedProject)) {
    throw new Error('useComputedProject requires a valid project route')
  }

  return computedProject
}
