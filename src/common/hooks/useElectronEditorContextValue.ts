import { useAtom } from 'jotai'
import { useCallback, useMemo, type SetStateAction } from 'react'
import { useNavigate, useParams } from 'react-router'

import { appRoutes } from '../appRoutes'
import { getPatchedProject } from '../component-patches/getPatchedProject'
import { getPatchedSubProject } from '../component-patches/getPatchedSubProject'
import { needsFullProjectPatch } from '../component-patches/needsFullProjectPatch'
import type { EditorContextType } from '../contexts/EditorContext'
import { getComputedSubProject } from '../logic/getComputedSubProject'
import type { ElectronProjectSchema } from '../schemas/electronProject'
import type { ProjectSchema } from '../schemas/project'
import type { SubProjectRouteParams } from '../schemas/routeParams'
import type { ComputedSubProjectSchema, SubProjectSchema } from '../schemas/subProject'
import { electronProjectAtom } from '../state/electronProjectAtom'
import { isDefined } from '../utils/isDefined'

export const useElectronEditorContextValue = (): EditorContextType => {
  const { subProjectId } = useParams<SubProjectRouteParams>()
  const navigate = useNavigate()
  const [electronProject, setElectronProject] = useAtom(electronProjectAtom)
  const project = electronProject?.project

  const subProject = useMemo<SubProjectSchema | undefined>(() => {
    if (!isDefined(project) || !isDefined(subProjectId)) {
      return undefined
    }

    return project.subProjects.find((candidate) => candidate.id === subProjectId)
  }, [project, subProjectId])

  const computedSubProject = useMemo<ComputedSubProjectSchema | undefined>(() => {
    if (!isDefined(project) || !isDefined(subProject)) {
      return undefined
    }

    return getComputedSubProject(subProject, project.stitchingSettings)
  }, [project, subProject])

  const setProject = useCallback(
    (update: SetStateAction<ProjectSchema>): void => {
      setElectronProject((currentElectronProject: ElectronProjectSchema | undefined): ElectronProjectSchema => {
        if (!isDefined(currentElectronProject)) {
          throw new Error('Cannot update the project because no project file is open.')
        }

        const updatedProject = typeof update === 'function' ? update(currentElectronProject.project) : update
        const projectToStore = needsFullProjectPatch(currentElectronProject.project, updatedProject)
          ? getPatchedProject(updatedProject)
          : updatedProject

        return {
          filePath: currentElectronProject.filePath,
          isDirty: true,
          project: projectToStore,
        }
      })
    },
    [setElectronProject],
  )

  const setSubProject = useCallback(
    (update: SetStateAction<SubProjectSchema>): void => {
      if (!isDefined(subProjectId)) {
        throw new Error('Cannot update the selected sub-project because no sub-project is selected.')
      }

      setProject((currentProject: ProjectSchema): ProjectSchema => {
        const subProjectIndex = currentProject.subProjects.findIndex((candidate) => candidate.id === subProjectId)

        if (subProjectIndex === -1) {
          throw new Error(
            `The sub-project selected by the route ("${subProjectId}") does not exist in the current project.`,
          )
        }

        const currentSubProject = currentProject.subProjects[subProjectIndex]
        const updatedSubProject = typeof update === 'function' ? update(currentSubProject) : update

        if (updatedSubProject.id !== subProjectId) {
          throw new Error('The selected sub-project ID cannot be changed')
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
    navigate(appRoutes.projects)
  }, [navigate])

  const navigateToProject = useCallback((): void => {
    if (!isDefined(electronProject)) {
      throw new Error('Cannot navigate to the current project because no project file is open.')
    }

    navigate(appRoutes.project(electronProject.project.id))
  }, [electronProject, navigate])

  const navigateToSubProject = useCallback(
    (targetSubProjectId: string): void => {
      if (!isDefined(electronProject)) {
        throw new Error('Cannot navigate to a sub-project because no project file is open.')
      }

      navigate(appRoutes.subProject(electronProject.project.id, targetSubProjectId))
    },
    [electronProject, navigate],
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
