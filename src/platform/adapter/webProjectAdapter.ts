import type { Getter, Setter } from 'jotai'

import type { ProjectSchema } from '../../schemas/project'
import { projectsAtom } from '../../state/projectsAtom'
import type { ProjectAdapterSchema } from './projectAdapter'

const getProject = (get: Getter, projectId: string | undefined): ProjectSchema | undefined => {
  return get(projectsAtom).find((project) => project.id === projectId)
}

const getFilePath = (): string | undefined => {
  return undefined
}

const setProject = (get: Getter, set: Setter, project: ProjectSchema): void => {
  const projects = get(projectsAtom)
  set(
    projectsAtom,
    projects.map((candidate): ProjectSchema => (candidate.id === project.id ? project : candidate)),
  )
}

export const webProjectAdapter: ProjectAdapterSchema = {
  getFilePath,
  getProject,
  setProject,
}
