import { useCallback } from 'react'

import { cloneSubProject as cloneSubProjectPure } from '../operations/project/cloneSubProject'
import { deleteSubProject as deleteSubProjectPure } from '../operations/project/deleteSubProject'
import { ProjectEditingSettingSchema } from '../schemas/settings'
import type { SubProjectSchema } from '../schemas/subProject'
import { id } from '../utils/id'
import { useProject } from './useProject'
import { useRecentProjectOperations } from './useRecentProjectOperations'

export const useProjectOperations = () => {
  const { project, setProject } = useProject()
  const { clearLastOpenedSubProject } = useRecentProjectOperations()

  const updateEditingSettings = useCallback(
    (update: Partial<ProjectEditingSettingSchema>): void => {
      setProject((currentProject) => ({
        ...currentProject,
        editingSettings: { ...currentProject.editingSettings, ...update },
      }))
    },
    [setProject],
  )

  const cloneSubProject = useCallback(
    (sourceSubProject: SubProjectSchema): void => {
      setProject((currentProject) => {
        return cloneSubProjectPure(currentProject, {
          getUnusedId: id,
          subProject: sourceSubProject,
        })
      })
    },
    [setProject],
  )

  const deleteSubProject = useCallback(
    (id: string): void => {
      setProject((currentProject) => deleteSubProjectPure(currentProject, { subProjectId: id }))
      clearLastOpenedSubProject(project.id, id)
    },
    [clearLastOpenedSubProject, project.id, setProject],
  )

  return { cloneSubProject, deleteSubProject, updateEditingSettings }
}
