import { useCallback } from 'react'

import { cloneSubProject as cloneSubProjectPure } from '../operations/project/cloneSubProject'
import { deleteSubProject as deleteSubProjectPure } from '../operations/project/deleteSubProject'
import { getUnusedName } from '../operations/subProject/utils/getUnusedName'
import { ProjectEditingSettingSchema } from '../schemas/settings'
import type { SubProjectSchema } from '../schemas/subProject'
import { id } from '../utils/id'
import { isDefined } from '../utils/isDefined'
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
        if (!isDefined(sourceSubProject)) {
          return currentProject
        }

        const rootPanel = sourceSubProject.components[sourceSubProject.root]

        if (!isDefined(rootPanel) || rootPanel.type !== 'root-panel') {
          return currentProject
        }

        const usedRootNames = currentProject.subProjects
          .map((candidate) => candidate.components[candidate.root])
          .filter(isDefined)
          .map((component) => component.name)
        const usedComponentNames = new Set([
          ...usedRootNames,
          ...Object.values(sourceSubProject.components)
            .filter((component) => component.id !== rootPanel.id)
            .map((component) => component.name),
        ])
        const rootName = getUnusedName(rootPanel.name, usedComponentNames)

        return cloneSubProjectPure(currentProject, {
          getUnusedId: id,
          rootName,
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
