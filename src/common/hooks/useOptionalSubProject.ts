import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useParams } from 'react-router'

import type { SubProjectRouteParams } from '../schemas/routeParams'
import type { ComputedSubProjectSchema, SubProjectSchema } from '../schemas/subProject'
import { computedSubProjectAtomFamily, subProjectAtomFamily } from '../state/projectAtoms'

type UseOptionalSubProjectResult = {
  subProject: SubProjectSchema | undefined
  computedSubProject: ComputedSubProjectSchema | undefined
}

export const useOptionalSubProject = (): UseOptionalSubProjectResult => {
  const { projectId, subProjectId } = useParams<SubProjectRouteParams>()
  const reference = useMemo(() => ({ projectId, subProjectId }), [projectId, subProjectId])
  const subProject = useAtomValue(subProjectAtomFamily(reference))
  const computedSubProject = useAtomValue(computedSubProjectAtomFamily(reference))

  return { computedSubProject, subProject }
}
