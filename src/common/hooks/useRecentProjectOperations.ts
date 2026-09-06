import { useSetAtom } from 'jotai'
import { useCallback, useMemo } from 'react'

import type { RecentProjectSchema } from '../schemas/recentProject'
import { recentProjectsAtom } from '../state/recentProjectsAtom'
import { isDefined } from '../utils/isDefined'

export type UseRecentProjectOperationsOutput = {
  markOpened: (key: string, subProjectId?: string) => void
  removeRecentProject: (key: string) => void
}

export const useRecentProjectOperations = (): UseRecentProjectOperationsOutput => {
  const setRecentProjects = useSetAtom(recentProjectsAtom)

  const markOpened = useCallback(
    (key: string, subProjectId?: string): void => {
      const recentProject: RecentProjectSchema = {
        lastOpenedAt: Date.now(),
        ...(isDefined(subProjectId) ? { lastSubProjectId: subProjectId } : {}),
      }

      setRecentProjects((recentProjects) => ({ ...recentProjects, [key]: recentProject }))
    },
    [setRecentProjects],
  )

  const removeRecentProject = useCallback(
    (key: string): void => {
      setRecentProjects((recentProjects) => {
        const remainingRecentProjects = { ...recentProjects }
        delete remainingRecentProjects[key]

        return remainingRecentProjects
      })
    },
    [setRecentProjects],
  )

  return useMemo<UseRecentProjectOperationsOutput>(
    () => ({ markOpened, removeRecentProject }),
    [markOpened, removeRecentProject],
  )
}
