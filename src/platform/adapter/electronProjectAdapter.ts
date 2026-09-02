import type { Getter, Setter } from 'jotai'

import type { ProjectSchema } from '../../schemas/project'
import { electronProjectAtom } from '../../state/electronProjectAtom'
import { isDefined } from '../../utils/isDefined'
import type { ProjectAdapterSchema } from './projectAdapter'

const getProject = (get: Getter, projectId: string | undefined): ProjectSchema | undefined => {
  const electronProject = get(electronProjectAtom)

  if (!isDefined(electronProject) || electronProject.project.id !== projectId) {
    return undefined
  }

  return electronProject.project
}

const getProjectName = (get: Getter, projectId: string): string | undefined => {
  return getProject(get, projectId)?.name
}

const getFilePath = (get: Getter, projectId: string): string | undefined => {
  const electronProject = get(electronProjectAtom)

  if (!isDefined(electronProject) || electronProject.project.id !== projectId) {
    return undefined
  }

  return electronProject.filePath
}

const setProject = (get: Getter, set: Setter, project: ProjectSchema): void => {
  const electronProject = get(electronProjectAtom)

  if (!isDefined(electronProject)) {
    return
  }

  set(electronProjectAtom, {
    ...electronProject,
    isDirty: true,
    project,
  })
}

export const electronProjectAdapter: ProjectAdapterSchema = {
  getFilePath,
  getProjectName,
  getProject,
  setProject,
}
