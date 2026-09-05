import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState, type SetStateAction } from 'react'

import { Loadable } from '../../common/loadable'
import { fileManagement } from '../../common/platform/fileManagement'
import type { LoadableSchema } from '../../common/schemas/loadable'
import type { RecentProjectSchema, RecentProjectVisualisationSchema } from '../../common/schemas/recentProject'
import { recentProjectsAtom } from '../../common/state/recentProjectsAtom'
import { useDateFormatter } from '../../common/translations/translation'
import { isDefined } from '../../common/utils/isDefined'
import { electronAppRoutes } from '../electronAppRoutes'

export const useElectronRecentProjects = (): LoadableSchema<RecentProjectVisualisationSchema[]> => {
  const recents = useAtomValue(recentProjectsAtom)
  const formatDate = useDateFormatter()

  const candidates = useMemo<RecentProjectVisualisationSchema[]>(() => {
    return Object.entries(recents)
      .map(([projectId, recentProject]: [string, RecentProjectSchema]): RecentProjectVisualisationSchema => {
        return {
          formattedLastOpenedAt: formatDate(recentProject.lastOpenedAt),
          lastOpenedAt: recentProject.lastOpenedAt,
          link: isDefined(recentProject.lastSubProjectId)
            ? electronAppRoutes.subProject(recentProject.path, recentProject.lastSubProjectId)
            : electronAppRoutes.project(recentProject.path),
          path: recentProject.path,
          projectId,
          projectName: '',
          ...(isDefined(recentProject.lastSubProjectId) ? { subProjectId: recentProject.lastSubProjectId } : {}),
        }
      })
      .sort((left, right): number => right.lastOpenedAt - left.lastOpenedAt)
  }, [formatDate, recents])

  return useExistingElectronRecentProjects(candidates)
}

const useExistingElectronRecentProjects = (
  candidates: RecentProjectVisualisationSchema[],
): LoadableSchema<RecentProjectVisualisationSchema[]> => {
  const requestIdRef = useRef(0)
  const [recentProjects, setRecentProjects] = useState<LoadableSchema<RecentProjectVisualisationSchema[]>>(() =>
    Loadable.uninitialized(),
  )

  const setRecentProjectsForRequest = useCallback(
    (requestId: number, update: SetStateAction<LoadableSchema<RecentProjectVisualisationSchema[]>>): void => {
      if (requestId !== requestIdRef.current) {
        return
      }
      setRecentProjects(update)
    },
    [],
  )

  const loadRecentProjects = useEffectEvent(async (): Promise<void> => {
    const requestId = ++requestIdRef.current

    setRecentProjectsForRequest(requestId, (current) =>
      Loadable.hasValue(current) ? Loadable.loadingWith(current.data) : Loadable.loading(),
    )

    const filePaths = candidates.map((candidate) => candidate.path)
    const response = await fileManagement.findExistingFilePaths({ type: 'find-existing-file-paths', filePaths })

    if (response.type === 'error') {
      return setRecentProjectsForRequest(requestId, Loadable.failed(response))
    }

    const existingFilePaths = new Set(response.filePaths)
    const existingRecentProjects = candidates.filter((candidate) => existingFilePaths.has(candidate.path))

    setRecentProjectsForRequest(requestId, Loadable.loaded(existingRecentProjects))
  })

  useEffect(() => {
    loadRecentProjects()
  }, [candidates])

  return recentProjects
}
