import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import { appRoutes } from '../appRoutes'
import type { RecentProjectVisualisationSchema } from '../schemas/recentProject'
import { projectsAtom } from '../state/projectsAtom'
import { recentProjectsAtom } from '../state/recentProjectsAtom'
import { useDateFormatter } from '../translations/translation'
import { isDefined } from '../utils/isDefined'

export const useRecentProjects = (): RecentProjectVisualisationSchema[] => {
  const projects = useAtomValue(projectsAtom)
  const recents = useAtomValue(recentProjectsAtom)
  const formatDate = useDateFormatter()

  return useMemo(() => {
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
          link: isDefined(subProject) ? appRoutes.subProject(project.id, subProject.id) : appRoutes.project(project.id),
          path: recentProject.path,
          projectId: project.id,
          projectName: project.name,
          ...(isDefined(subProject) ? { subProjectId: subProject.id } : {}),
        }
      })
  }, [formatDate, projects, recents])
}
