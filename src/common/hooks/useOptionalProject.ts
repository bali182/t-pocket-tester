import { useEditorContext } from '../contexts/EditorContext'
import type { ProjectSchema } from '../schemas/project'

type UseOptionalProjectResult = {
  project: ProjectSchema | undefined
}

export const useOptionalProject = (): UseOptionalProjectResult => {
  const { project } = useEditorContext()
  return { project }
}
