import type { ProjectSchema } from '../schemas/project'
import type { SetStateAction } from 'react'
import { isDefined } from '../utils/isDefined'
import { useOptionalProject } from './useOptionalProject'

type UseProjectResult = {
  project: ProjectSchema
  setProject: (project: SetStateAction<ProjectSchema>) => void
}

export const useProject = (): UseProjectResult => {
  const { project, setProject } = useOptionalProject()

  if (!isDefined(project)) {
    throw new Error('useProject requires a valid project route')
  }

  return { project, setProject }
}
