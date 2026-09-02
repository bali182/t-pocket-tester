import { useAtomCallback } from 'jotai/react/utils'
import { useCallback } from 'react'

import { projectAdapter } from '../platform/adapter/projectAdapter'
import type { RecentProjectSchema } from '../schemas/recentProject'
import { recentProjectsAtom } from '../state/recentProjectsAtom'
import { isDefined } from '../utils/isDefined'

export const useRecentProjectOperations = () => {
  const markProjectOpened = useAtomCallback(
    useCallback((get, set, projectId: string, subProjectId?: string): void => {
      const projectName = projectAdapter.getProjectName(get, projectId)

      if (!isDefined(projectName)) {
        return
      }

      const filePath = projectAdapter.getFilePath(get, projectId)
      const recentProject: RecentProjectSchema = {
        lastOpenedAt: Date.now(),
        path: isDefined(filePath) ? filePath : '',
        projectName,
        ...(isDefined(subProjectId) ? { lastSubProjectId: subProjectId } : {}),
      }

      set(recentProjectsAtom, { ...get(recentProjectsAtom), [projectId]: recentProject })
    }, []),
  )

  const removeRecentProject = useAtomCallback(
    useCallback((get, set, projectId: string): void => {
      const remainingRecentProjects = { ...get(recentProjectsAtom) }
      delete remainingRecentProjects[projectId]
      set(recentProjectsAtom, remainingRecentProjects)
    }, []),
  )

  const clearLastOpenedSubProject = useAtomCallback(
    useCallback((get, set, projectId: string, subProjectId: string): void => {
      const recentProject = get(recentProjectsAtom)[projectId]

      if (!isDefined(recentProject) || recentProject.lastSubProjectId !== subProjectId) {
        return
      }

      const { lastSubProjectId: _lastSubProjectId, ...recentProjectWithoutSubProject } = recentProject
      set(recentProjectsAtom, {
        ...get(recentProjectsAtom),
        [projectId]: recentProjectWithoutSubProject,
      })
    }, []),
  )

  return { clearLastOpenedSubProject, markProjectOpened, removeRecentProject }
}
