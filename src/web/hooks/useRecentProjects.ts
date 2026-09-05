import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import type { RecentProjectVisualisationSchema } from '../../common/schemas/recentProject'
import { projectsAtom } from '../../common/state/projectsAtom'
import { recentProjectsAtom } from '../../common/state/recentProjectsAtom'
import { useDateFormatter } from '../../common/translations/translation'
import { isDefined } from '../../common/utils/isDefined'
import { webAppRoutes } from '../webAppRoutes'

export const useRecentProjects = (): RecentProjectVisualisationSchema[] => {
  const projects = useAtomValue(projectsAtom)
  const recents = useAtomValue(recentProjectsAtom)
  const formatDate = useDateFormatter()

  return useMemo<RecentProjectVisualisationSchema[]>(() => {
    return [...projects]
      .sort((left, right) => (recents[right.id]?.lastOpenedAt ?? 0) - (recents[left.id]?.lastOpenedAt ?? 0))
      .filter((project) => isDefined(recents[project.id]))
      .map((project): RecentProjectVisualisationSchema => {
        const recentProject = recents[project.id]
        const lastOpenedSubProject = isDefined(recentProject?.lastSubProjectId)
          ? project.subProjects.find((subProject) => subProject.id === recentProject.lastSubProjectId)
          : undefined
        const subProject = isDefined(lastOpenedSubProject) ? lastOpenedSubProject : project.subProjects[0]

        return {
          lastOpenedAt: recentProject.lastOpenedAt,
          formattedLastOpenedAt: isDefined(recentProject) ? formatDate(recentProject.lastOpenedAt) : '-',
          link: isDefined(subProject)
            ? webAppRoutes.subProject(project.id, subProject.id)
            : webAppRoutes.project(project.id),
          path: recentProject.path,
          projectId: project.id,
          projectName: project.name,
          ...(isDefined(subProject) ? { subProjectId: subProject.id } : {}),
        }
      })
  }, [formatDate, projects, recents])
}
