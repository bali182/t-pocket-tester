import { useAtom } from 'jotai'
import { useParams } from 'react-router'

import { projectAtomFamily } from '../state/projectAtoms'

export const useOptionalProject = () => {
  const { projectId } = useParams()
  return useAtom(projectAtomFamily(projectId))
}
