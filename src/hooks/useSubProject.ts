import { isDefined } from '../utils/isDefined'
import { useOptionalSubProject } from './useOptionalSubProject'

export const useSubProject = () => {
  const value = useOptionalSubProject()

  if (!isDefined(value)) {
    throw new Error('useSubProject requires a valid subproject route')
  }

  return value
}
