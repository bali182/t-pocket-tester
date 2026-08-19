import { useCallback } from 'react'

import { cloneSubProject as cloneSubProjectPure } from '../operations/project/cloneSubProject'
import { deleteSubProject as deleteSubProjectPure } from '../operations/project/deleteSubProject'
import { getUnusedName } from '../operations/subProject/utils/getUnusedName'
import { ProjectEditingSettingSchema } from '../schemas/settings'
import type { SubProjectSchema } from '../schemas/subProject'
import { id } from '../utils/id'
import { isDefined } from '../utils/isDefined'
import { useProject } from './useProject'
import { useSubProject } from './useSubProject'

export const useProjectOperations = () => {
  const { setProject } = useProject()
  const { subProject } = useSubProject()

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
    (sourceSubProject?: SubProjectSchema): void => {
      setProject((currentProject) => {
        const subProjectToClone = isDefined(sourceSubProject)
          ? sourceSubProject
          : currentProject.subProjects.find((candidate) => candidate.id === subProject.id)

        if (!isDefined(subProjectToClone)) {
          return currentProject
        }

        const rootPanel = subProjectToClone.components[subProjectToClone.root]

        if (!isDefined(rootPanel) || rootPanel.type !== 'root-panel') {
          return currentProject
        }

        const usedRootNames = currentProject.subProjects
          .map((candidate) => candidate.components[candidate.root])
          .filter(isDefined)
          .map((component) => component.name)
        const usedComponentNames = new Set([
          ...usedRootNames,
          ...Object.values(subProjectToClone.components)
            .filter((component) => component.id !== rootPanel.id)
            .map((component) => component.name),
        ])
        const rootName = getUnusedName(rootPanel.name, usedComponentNames)

        return cloneSubProjectPure(currentProject, {
          getUnusedId: id,
          rootName,
          subProject: subProjectToClone,
        })
      })
    },
    [setProject, subProject.id],
  )

  const deleteSubProject = useCallback((): void => {
    setProject((currentProject) => deleteSubProjectPure(currentProject, { subProjectId: subProject.id }))
  }, [setProject, subProject.id])

  const setSubProject = useCallback(
    (updatedSubProject: SubProjectSchema): void => {
      setProject((currentProject) => ({
        ...currentProject,
        subProjects: currentProject.subProjects.map((candidate) =>
          candidate.id === subProject.id ? updatedSubProject : candidate,
        ),
      }))
    },
    [setProject, subProject.id],
  )

  return { cloneSubProject, deleteSubProject, setSubProject, updateEditingSettings }
}
