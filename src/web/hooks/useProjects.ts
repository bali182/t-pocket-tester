import { useAtomValue } from 'jotai'
import { useAtomCallback } from 'jotai/react/utils'
import { useCallback } from 'react'

import { useRecentProjectOperations } from '../../common/hooks/useRecentProjectOperations'
import type { ProjectSchema } from '../../common/schemas/project'
import { isDefined } from '../../common/utils/isDefined'
import { projectsAtom } from '../state/projectsAtom'

// TODO this should contain real projects
export const useProjects = () => {
  const projects = useAtomValue(projectsAtom)
  const { removeRecentProject } = useRecentProjectOperations()

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
    useCallback(
      (get, set, projectId: string): void => {
        set(
          projectsAtom,
          get(projectsAtom).filter((project) => project.id !== projectId),
        )
        removeRecentProject(projectId)
      },
      [removeRecentProject],
    ),
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
