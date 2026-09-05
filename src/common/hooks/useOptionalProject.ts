import type { SetStateAction } from 'react'

import { useEditorContext } from '../contexts/EditorContext'
import type { ProjectSchema } from '../schemas/project'

type UseOptionalProjectResult = {
  project: ProjectSchema | undefined
  setProject: (project: SetStateAction<ProjectSchema>) => void
}

export const useOptionalProject = (): UseOptionalProjectResult => {
  const { project, setProject } = useEditorContext()
  return { project, setProject }
}
