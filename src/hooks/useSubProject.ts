import { useAtom, useAtomValue } from 'jotai'
import { computedSubProjectAtom, subProjectAtom } from '../state/subProjectAtom'
import { isDefined } from '../utils/isDefined'
import { useSubProjectOperations } from './useSubProjectOperations'

export const useSubProject = () => {
  const [subProject, setSubProject] = useAtom(subProjectAtom)
  const computedSubProject = useAtomValue(computedSubProjectAtom)
  const operations = useSubProjectOperations()

  if (!isDefined(subProject) || !isDefined(computedSubProject)) {
    throw new Error('useProject requires an opened project')
  }

  return {
    ...operations,
    setSubProject,
    subProject,
    computedSubProject,
  }
}
