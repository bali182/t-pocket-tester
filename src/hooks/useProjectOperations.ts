import { useCallback } from 'react'

import { cloneSubProject as cloneSubProjectPure } from '../operations/project/cloneSubProject'
import { deleteSubProject as deleteSubProjectPure } from '../operations/project/deleteSubProject'
import { getUnusedName } from '../operations/subProject/utils/getUnusedName'
import { SubProjectSchema } from '../schemas/subProject'
import { id } from '../utils/id'
import { isDefined } from '../utils/isDefined'
import { useProject } from './useProject'
import { useSubProject } from './useSubProject'

export const useProjectOperations = () => {
  const { setProject } = useProject()
  const { subProject } = useSubProject()

  const cloneSubProject = useCallback(
    (cloned?: SubProjectSchema): void => {
      setProject((currentProject) => {
        const currentSubProject = isDefined(cloned)
          ? cloned
          : currentProject.subProjects.find((candidate) => candidate.id === subProject.id)

        if (!isDefined(currentSubProject)) {
          return currentProject
        }

        const rootPanel = currentSubProject.components[currentSubProject.root]

        if (!isDefined(rootPanel) || rootPanel.type !== 'root-panel') {
          return currentProject
        }

        const usedRootNames = currentProject.subProjects
          .map((candidate) => candidate.components[candidate.root])
          .filter(isDefined)
          .map((component) => component.name)
        const usedComponentNames = new Set([
          ...usedRootNames,
          ...Object.values(currentSubProject.components)
            .filter((component) => component.id !== rootPanel.id)
            .map((component) => component.name),
        ])
        const rootName = getUnusedName(rootPanel.name, usedComponentNames)

        return cloneSubProjectPure(currentProject, {
          getUnusedId: id,
          rootName,
          subProject: currentSubProject,
        })
      })
    },
    [setProject, subProject.id],
  )

  const deleteSubProject = useCallback((): void => {
    setProject((currentProject) => deleteSubProjectPure(currentProject, { subProjectId: subProject.id }))
  }, [setProject, subProject.id])

  return { cloneSubProject, deleteSubProject }
}
