import type { ProjectSchema } from '../schemas/project'
import { isDefined } from '../utils/isDefined'
import { useOptionalProject } from './useOptionalProject'

type UseProjectResult = {
  project: ProjectSchema
}

export const useProject = (): UseProjectResult => {
  const { project } = useOptionalProject()

  if (!isDefined(project)) {
    throw new Error('useProject requires a valid project route')
  }

  return { project }
}
