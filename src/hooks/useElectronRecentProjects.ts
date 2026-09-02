import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState, type SetStateAction } from 'react'

import { appRoutes } from '../appRoutes'
import { Loadable } from '../loadable'
import { fileManagement } from '../platform/fileManagement'
import type { LoadableSchema } from '../schemas/loadable'
import type { RecentProjectVisualisationSchema } from '../schemas/recentProject'
import { recentProjectsAtom } from '../state/recentProjectsAtom'
import { useDateFormatter } from '../translations/translation'
import { isDefined } from '../utils/isDefined'

export const useElectronRecentProjects = (): LoadableSchema<RecentProjectVisualisationSchema[]> => {
  const recents = useAtomValue(recentProjectsAtom)
  const formatDate = useDateFormatter()
  const [recentProjects, setRecentProjects] = useState<LoadableSchema<RecentProjectVisualisationSchema[]>>(() =>
    Loadable.uninitialized(),
  )
  const requestIdRef = useRef(0)

  const setRecentProjectsForRequest = useCallback(
    (requestId: number, update: SetStateAction<LoadableSchema<RecentProjectVisualisationSchema[]>>): void => {
      if (requestId !== requestIdRef.current) {
        return
      }
      setRecentProjects(update)
    },
    [],
  )

  const candidates = useMemo((): RecentProjectVisualisationSchema[] => {
    return Object.entries(recents)
      .map(([projectId, recentProject]): RecentProjectVisualisationSchema => {
        return {
          lastOpenedAt: recentProject.lastOpenedAt,
          formattedLastOpenedAt: formatDate(recentProject.lastOpenedAt),
          link: isDefined(recentProject.lastSubProjectId)
            ? appRoutes.subProject(projectId, recentProject.lastSubProjectId)
            : appRoutes.project(projectId),
          path: recentProject.path,
          projectId,
          projectName: recentProject.projectName,
          ...(isDefined(recentProject.lastSubProjectId) ? { subProjectId: recentProject.lastSubProjectId } : {}),
        }
      })
      .sort((a, b) => a.lastOpenedAt - b.lastOpenedAt)
  }, [formatDate, recents])

  const loadRecentProjects = useEffectEvent(async (): Promise<void> => {
    const requestId = ++requestIdRef.current

    setRecentProjectsForRequest(requestId, (current) =>
      Loadable.hasValue(current) ? Loadable.loadingWith(current.data) : Loadable.loading(),
    )
    const response = await fileManagement.findExistingFilePaths({
      filePaths: candidates.map((candidate): string => candidate.path),
      type: 'find-existing-file-paths',
    })

    if (response.type === 'error') {
      setRecentProjectsForRequest(requestId, Loadable.failed(response))
      return
    }

    const existingFilePaths = new Set(response.filePaths)
    setRecentProjectsForRequest(
      requestId,
      Loadable.loaded(candidates.filter((candidate): boolean => existingFilePaths.has(candidate.path))),
    )
  })

  useEffect(() => {
    loadRecentProjects()
  }, [candidates])

  return recentProjects
}
