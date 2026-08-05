import { isDefined } from '../utils/isDefined'
import { useOptionalProject } from './useOptionalProject'

export const useProject = () => {
  const [project, setProject] = useOptionalProject()

  if (!isDefined(project)) {
    throw new Error('useProject requires a valid project route')
  }

  return { project, setProject }
}
