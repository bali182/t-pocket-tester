import { useAtom } from 'jotai'
import type { SetStateAction } from 'react'
import { useParams } from 'react-router'

import type { ProjectSchema } from '../schemas/project'
import type { ProjectRouteParams } from '../schemas/routeParams'
import { projectAtomFamily } from '../state/projectAtoms'

type UseOptionalProjectResult = {
  project: ProjectSchema | undefined
  setProject: (project: SetStateAction<ProjectSchema>) => void
}

export const useOptionalProject = (): UseOptionalProjectResult => {
  const { projectId } = useParams<ProjectRouteParams>()
  const [project, setProject] = useAtom(projectAtomFamily(projectId))
  return { project, setProject }
}
