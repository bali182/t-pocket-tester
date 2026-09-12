import { useCallback, useMemo } from 'react'

import type { RecentProjectSchema } from '../schemas/recentProject'
import { isDefined } from '../utils/isDefined'
import { useGlobalSettings } from './useGlobalSettings'

export type UseRecentProjectOperationsOutput = {
  markOpened: (key: string, subProjectId?: string) => void
  removeRecentProject: (key: string) => void
}

export const useRecentProjectOperations = (): UseRecentProjectOperationsOutput => {
  const { setRecentProjects, setSettings } = useGlobalSettings()

  const markOpened = useCallback(
    (key: string, subProjectId?: string): void => {
      const recentProject: RecentProjectSchema = {
        lastOpenedAt: Date.now(),
        ...(isDefined(subProjectId) ? { lastSubProjectId: subProjectId } : {}),
      }

      setRecentProjects({ [key]: recentProject })
    },
    [setRecentProjects],
  )

  const removeRecentProject = useCallback(
    (key: string): void => {
      setSettings((current) => {
        const remainingRecentProjects = { ...current.recentProjects }
        delete remainingRecentProjects[key]

        return { ...current, recentProjects: remainingRecentProjects }
      })
    },
    [setSettings],
  )

  return useMemo<UseRecentProjectOperationsOutput>(
    () => ({ markOpened, removeRecentProject }),
    [markOpened, removeRecentProject],
  )
}
