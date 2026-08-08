import { useCallback } from 'react'
import { useNavigate } from 'react-router'

import { appRoutes } from '../appRoutes'
import { getUnusedName } from '../operations/subProject/utils/getUnusedName'
import { useTranslation } from '../translations/translation'
import { createSubProject as createSubProjectSchema } from '../utils/createSubProject'
import { isDefined } from '../utils/isDefined'
import { useProject } from './useProject'

type UseCreateSubProjectResult = {
  createSubProject: () => void
}

export const useCreateSubProject = (): UseCreateSubProjectResult => {
  const { project, setProject } = useProject()
  const t = useTranslation()
  const navigate = useNavigate()

  const createSubProject = useCallback((): void => {
    const usedRootNames = new Set(
      project.subProjects
        .map((subProject) => subProject.components[subProject.root])
        .filter(isDefined)
        .map((rootPanel) => rootPanel.name),
    )
    const rootName = getUnusedName(t.defaults.rootComponentName, usedRootNames)
    const subProject = createSubProjectSchema(rootName)

    setProject({ ...project, subProjects: [...project.subProjects, subProject] })
    navigate(appRoutes.subProject(project.id, subProject.id))
  }, [navigate, project, setProject, t])

  return { createSubProject }
}
