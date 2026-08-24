import type { Getter } from 'jotai'
import { useAtomCallback } from 'jotai/react/utils'
import { useCallback, useMemo } from 'react'

import { addSubProject as addSubProjectPure } from '../operations/project/addSubProject'
import { cloneSubProject as cloneSubProjectPure } from '../operations/project/cloneSubProject'
import { deleteSubProject as deleteSubProjectPure } from '../operations/project/deleteSubProject'
import type { ProjectSchema } from '../schemas/project'
import { ProjectEditingSettingSchema } from '../schemas/settings'
import type { SubProjectSchema } from '../schemas/subProject'
import { projectAtomFamily } from '../state/projectAtoms'
import { useTranslation } from '../translations/translation'
import { id } from '../utils/id'
import { isDefined } from '../utils/isDefined'
import { useOptionalProject } from './useOptionalProject'
import { useRecentProjectOperations } from './useRecentProjectOperations'

export const useProjectOperations = () => {
  const { project } = useOptionalProject()
  const { clearLastOpenedSubProject } = useRecentProjectOperations()
  const t = useTranslation()
  const projectId = project?.id

  const updateEditingSettings = useAtomCallback(
    useCallback(
      (get, set, update: Partial<ProjectEditingSettingSchema>): void => {
        const project = ensureProject(get, projectId)
        set(projectAtomFamily(projectId), {
          ...project,
          editingSettings: { ...project.editingSettings, ...update },
        })
      },
      [projectId],
    ),
  )

  const createSubProject = useAtomCallback(
    useCallback(
      (get, set): SubProjectSchema => {
        const project = ensureProject(get, projectId)
        const result = addSubProjectPure(project, { baseRootComponentName: t.defaults.rootComponentName })
        set(projectAtomFamily(projectId), result.project)
        return result.subProject
      },
      [projectId, t],
    ),
  )

  const cloneSubProject = useAtomCallback(
    useCallback(
      (get, set, sourceSubProject: SubProjectSchema): void => {
        const project = ensureProject(get, projectId)
        set(
          projectAtomFamily(projectId),
          cloneSubProjectPure(project, {
            getUnusedId: id,
            subProject: sourceSubProject,
          }),
        )
      },
      [projectId],
    ),
  )

  const deleteSubProject = useAtomCallback(
    useCallback(
      (get, set, subProjectId: string): void => {
        const project = ensureProject(get, projectId)
        set(projectAtomFamily(projectId), deleteSubProjectPure(project, { subProjectId }))
        clearLastOpenedSubProject(project.id, subProjectId)
      },
      [clearLastOpenedSubProject, projectId],
    ),
  )

  return useMemo(
    () => ({ createSubProject, cloneSubProject, deleteSubProject, updateEditingSettings }),
    [cloneSubProject, createSubProject, deleteSubProject, updateEditingSettings],
  )
}

const ensureProject = (get: Getter, projectId: string | undefined): ProjectSchema => {
  const project = get(projectAtomFamily(projectId))

  if (!isDefined(project)) {
    throw new Error('A valid project is required')
  }

  return project
}
