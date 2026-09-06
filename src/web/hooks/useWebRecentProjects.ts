import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import type { RecentProjectVisualisationSchema } from '../../common/schemas/recentProject'
import { recentProjectsAtom } from '../../common/state/recentProjectsAtom'
import { useDateFormatter } from '../../common/translations/translation'
import { isDefined } from '../../common/utils/isDefined'
import { projectsAtom } from '../state/projectsAtom'
import { webAppRoutes } from '../webAppRoutes'

export const useWebRecentProjects = (): RecentProjectVisualisationSchema[] => {
  const projects = useAtomValue(projectsAtom)
  const recentProjects = useAtomValue(recentProjectsAtom)
  const formatDate = useDateFormatter()

  return useMemo<RecentProjectVisualisationSchema[]>(() => {
    return projects
      .filter((project): boolean => isDefined(recentProjects[project.id]))
      .map((project): RecentProjectVisualisationSchema => {
        const recentProject = recentProjects[project.id]
        const lastOpenedSubProject = isDefined(recentProject?.lastSubProjectId)
          ? project.subProjects.find((subProject) => subProject.id === recentProject.lastSubProjectId)
          : undefined
        const subProject = isDefined(lastOpenedSubProject) ? lastOpenedSubProject : project.subProjects[0]

        return {
          formattedLastOpenedAt: formatDate(recentProject.lastOpenedAt),
          id: project.id,
          label: project.name,
          link: isDefined(subProject)
            ? webAppRoutes.subProject(project.id, subProject.id)
            : webAppRoutes.project(project.id),
          lastOpenedAt: recentProject.lastOpenedAt,
        }
      })
      .sort((left, right): number => right.lastOpenedAt - left.lastOpenedAt)
  }, [formatDate, projects, recentProjects])
}
