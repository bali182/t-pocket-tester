import type { Getter, Setter } from 'jotai'

import { Loadable } from '../../loadable'
import type { ProjectSchema } from '../../schemas/project'
import { electronProjectAtom } from '../../state/electronProjectAtom'
import { isDefined } from '../../utils/isDefined'
import type { ProjectAdapterSchema } from './projectAdapter'

const getProject = (get: Getter, projectId: string | undefined): ProjectSchema | undefined => {
  const electronProject = Loadable.get(get(electronProjectAtom))

  if (!isDefined(electronProject) || electronProject.project.id !== projectId) {
    return undefined
  }

  return electronProject.project
}

const getFilePath = (get: Getter, projectId: string): string | undefined => {
  const electronProject = Loadable.get(get(electronProjectAtom))

  if (!isDefined(electronProject) || electronProject.project.id !== projectId) {
    return undefined
  }

  return electronProject.filePath
}

const setProject = (get: Getter, set: Setter, project: ProjectSchema): void => {
  const electronProject = get(electronProjectAtom)

  if (electronProject.type !== 'loaded') {
    return
  }

  set(
    electronProjectAtom,
    Loadable.loaded({
      ...electronProject.data,
      isDirty: true,
      project,
    }),
  )
}

export const electronProjectAdapter: ProjectAdapterSchema = {
  getFilePath,
  getProject,
  setProject,
}
