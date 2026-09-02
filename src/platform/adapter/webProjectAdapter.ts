import type { Getter, Setter } from 'jotai'

import type { ProjectSchema } from '../../schemas/project'
import { projectsAtom } from '../../state/projectsAtom'
import type { ProjectAdapterSchema } from './projectAdapter'

const getProject = (get: Getter, projectId: string | undefined): ProjectSchema | undefined => {
  return get(projectsAtom).find((project) => project.id === projectId)
}

const setProject = (get: Getter, set: Setter, project: ProjectSchema): void => {
  const projects = get(projectsAtom)
  set(
    projectsAtom,
    projects.map((candidate) => (candidate.id === project.id ? project : candidate)),
  )
}

export const webProjectAdapter: ProjectAdapterSchema = {
  getProject,
  setProject,
}
