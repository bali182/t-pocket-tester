import { useAtomValue } from 'jotai'
import { useAtomCallback } from 'jotai/react/utils'
import { useCallback } from 'react'
import type { ProjectSchema } from '../schemas/project'
import { projectsAtom } from '../state/projectsAtom'
import { isDefined } from '../utils/isDefined'

// TODO this should contain real projects
export const useProjects = () => {
  const projects = useAtomValue(projectsAtom)

  const addProject = useAtomCallback(
    useCallback((get, set, project: ProjectSchema): ProjectSchema => {
      set(projectsAtom, [...get(projectsAtom), project])
      return project
    }, []),
  )

  const updateProject = useAtomCallback(
    useCallback((get, set, project: ProjectSchema): void => {
      const projects = get(projectsAtom)

      if (!projects.some((candidate) => candidate.id === project.id)) {
        throw new Error('Project not found!')
      }

      set(
        projectsAtom,
        projects.map((candidate) => (candidate.id === project.id ? project : candidate)),
      )
    }, []),
  )

  const deleteProject = useAtomCallback(
    useCallback((get, set, projectId: string): void => {
      set(
        projectsAtom,
        get(projectsAtom).filter((project) => project.id !== projectId),
      )
    }, []),
  )

  const getProjectById = useAtomCallback(
    useCallback((get, set, projectId: string): ProjectSchema => {
      const project = get(projectsAtom).find((project) => project.id === projectId)
      if (!isDefined(project)) {
        throw new Error('Project not found!')
      }
      return project
    }, []),
  )

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
  }
}
