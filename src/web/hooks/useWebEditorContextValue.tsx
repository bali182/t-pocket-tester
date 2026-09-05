import { useAtom } from 'jotai'
import { useCallback, useMemo, type SetStateAction } from 'react'
import { useNavigate, useParams } from 'react-router'

import { getPatchedProject } from '../../common/component-patches/getPatchedProject'
import { getPatchedSubProject } from '../../common/component-patches/getPatchedSubProject'
import { needsFullProjectPatch } from '../../common/component-patches/needsFullProjectPatch'
import type { EditorContextType } from '../../common/contexts/EditorContext'
import { getComputedSubProject } from '../../common/logic/getComputedSubProject'
import type { ProjectSchema } from '../../common/schemas/project'
import type { ComputedSubProjectSchema, SubProjectSchema } from '../../common/schemas/subProject'
import { projectsAtom } from '../../common/state/projectsAtom'
import { isDefined } from '../../common/utils/isDefined'
import type { WebSubProjectRouteParamsSchema } from '../schemas/webRouteParams'
import { webAppRoutes } from '../webAppRoutes'

export const useWebEditorContextValue = (): EditorContextType => {
  const { projectId, subProjectId } = useParams<WebSubProjectRouteParamsSchema>()
  const navigate = useNavigate()
  const [projects, setProjects] = useAtom(projectsAtom)

  const project = useMemo<ProjectSchema | undefined>(() => {
    return projects.find((candidate) => candidate.id === projectId)
  }, [projectId, projects])

  const subProject = useMemo<SubProjectSchema | undefined>(() => {
    return project?.subProjects.find((candidate) => candidate.id === subProjectId)
  }, [project?.subProjects, subProjectId])

  const computedSubProject = useMemo<ComputedSubProjectSchema | undefined>(() => {
    if (!isDefined(project) || !isDefined(subProject)) {
      return undefined
    }
    return getComputedSubProject(subProject, project.stitchingSettings)
  }, [project, subProject])

  const setProject = useCallback(
    (update: SetStateAction<ProjectSchema>): void => {
      const selectedProjectId = ensureSelectedProjectId(projectId)

      setProjects((currentProjects) => {
        const projectIndex = currentProjects.findIndex((candidate) => candidate.id === selectedProjectId)

        if (projectIndex === -1) {
          throw new Error(
            `The project selected by the route ("${selectedProjectId}") does not exist in the current project list.`,
          )
        }

        const currentProject = currentProjects[projectIndex]
        const updatedProject = typeof update === 'function' ? update(currentProject) : update
        const projectToStore = needsFullProjectPatch(currentProject, updatedProject)
          ? getPatchedProject(updatedProject)
          : updatedProject

        return [...currentProjects.slice(0, projectIndex), projectToStore, ...currentProjects.slice(projectIndex + 1)]
      })
    },
    [projectId, setProjects],
  )

  const setSubProject = useCallback(
    (update: SetStateAction<SubProjectSchema>): void => {
      const selectedSubProjectId = ensureSelectedSubProjectId(subProjectId)

      setProject((currentProject: ProjectSchema): ProjectSchema => {
        const subProjectIndex = currentProject.subProjects.findIndex(
          (candidate) => candidate.id === selectedSubProjectId,
        )

        if (subProjectIndex === -1) {
          throw new Error(
            `The sub-project selected by the route ("${selectedSubProjectId}") does not exist in the current project.`,
          )
        }

        const currentSubProject = currentProject.subProjects[subProjectIndex]
        const updatedSubProject = typeof update === 'function' ? update(currentSubProject) : update

        if (updatedSubProject.id !== selectedSubProjectId) {
          throw new Error('The selected subproject ID cannot be changed')
        }

        const computedUpdatedSubProject = getComputedSubProject(updatedSubProject, currentProject.stitchingSettings)
        const patchedSubProject = getPatchedSubProject(updatedSubProject, computedUpdatedSubProject)
        const subProjects: SubProjectSchema[] = [
          ...currentProject.subProjects.slice(0, subProjectIndex),
          patchedSubProject,
          ...currentProject.subProjects.slice(subProjectIndex + 1),
        ]

        return {
          ...currentProject,
          subProjects,
        }
      })
    },
    [setProject, subProjectId],
  )

  const navigateToProjects = useCallback((): void => {
    navigate(webAppRoutes.projects)
  }, [navigate])

  const navigateToProject = useCallback((): void => {
    navigate(webAppRoutes.project(ensureSelectedProjectId(projectId)))
  }, [navigate, projectId])

  const navigateToSubProject = useCallback(
    (targetSubProjectId: string): void => {
      navigate(webAppRoutes.subProject(ensureSelectedProjectId(projectId), targetSubProjectId))
    },
    [navigate, projectId],
  )

  return useMemo<EditorContextType>(
    () => ({
      computedSubProject,
      navigateToProject,
      navigateToProjects,
      navigateToSubProject,
      project,
      setProject,
      setSubProject,
      subProject,
    }),
    [
      computedSubProject,
      navigateToProject,
      navigateToProjects,
      navigateToSubProject,
      project,
      setProject,
      setSubProject,
      subProject,
    ],
  )
}

const ensureSelectedProjectId = (projectId: string | undefined): string => {
  if (!isDefined(projectId)) {
    throw new Error('This operation can only run in the context of a valid project, derived from the route.')
  }
  return projectId
}

const ensureSelectedSubProjectId = (subProjectId: string | undefined): string => {
  if (!isDefined(subProjectId)) {
    throw new Error('This operation can only run in the context of a valid sub-project, derived from the route.')
  }
  return subProjectId
}
