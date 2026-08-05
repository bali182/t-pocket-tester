import { useAtom, useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useParams } from 'react-router'

import { SubProjectRouteParams } from '../schemas/routeParams'
import { computedSubProjectAtomFamily, subProjectAtomFamily } from '../state/projectAtoms'
import { isDefined } from '../utils/isDefined'
import { useOptionalProject } from './useOptionalProject'

export const useOptionalSubProject = () => {
  const { subProjectId } = useParams<SubProjectRouteParams>()
  const [project] = useOptionalProject()
  const reference = useMemo(() => ({ projectId: project?.id, subProjectId }), [project?.id, subProjectId])
  const [subProject, setSubProject] = useAtom(subProjectAtomFamily(reference))
  const computedSubProject = useAtomValue(computedSubProjectAtomFamily(reference))

  if (!isDefined(project) || !isDefined(subProject) || !isDefined(computedSubProject)) {
    return undefined
  }

  return { computedSubProject, project, setSubProject, subProject }
}
