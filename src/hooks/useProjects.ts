import { useAtomValue } from 'jotai'
import { useAtomCallback } from 'jotai/react/utils'
import { useCallback } from 'react'
import { ProjectSchema } from '../schemas/project'
import { projectsAtom } from '../state/projectsAtom'
import { isDefined } from '../utils/isDefined'

export const useProjects = () => {
  const projects = useAtomValue(projectsAtom)

  const addProject = useAtomCallback(
    useCallback((get, set, project: ProjectSchema): ProjectSchema => {
      // Implement me
      return project
    }, []),
  )

  const updateProject = useAtomCallback(
    useCallback((get, set, project: ProjectSchema): void => {
      // Implement me
    }, []),
  )

  const deleteProject = useAtomCallback(
    useCallback((get, set, projectId: string): void => {
      // Implement me
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
