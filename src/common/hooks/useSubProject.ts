import type { ComputedSubProjectSchema, SubProjectSchema } from '../schemas/subProject'
import { isDefined } from '../utils/isDefined'
import { useOptionalSubProject } from './useOptionalSubProject'

type UseSubProjectResult = {
  subProject: SubProjectSchema
  computedSubProject: ComputedSubProjectSchema
}

export const useSubProject = (): UseSubProjectResult => {
  const { subProject, computedSubProject } = useOptionalSubProject()

  if (!isDefined(subProject) || !isDefined(computedSubProject)) {
    throw new Error('useSubProject requires a valid subproject route')
  }

  return { computedSubProject, subProject }
}
