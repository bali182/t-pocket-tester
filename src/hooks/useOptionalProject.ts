import { useAtom } from 'jotai'
import { useParams } from 'react-router'

import { ProjectRouteParams } from '../schemas/routeParams'
import { projectAtomFamily } from '../state/projectAtoms'

export const useOptionalProject = () => {
  const { projectId } = useParams<ProjectRouteParams>()
  return useAtom(projectAtomFamily(projectId))
}
