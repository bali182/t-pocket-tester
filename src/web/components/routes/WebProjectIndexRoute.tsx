import { useEffect, type FC } from 'react'
import { Navigate } from 'react-router'

import { useProject } from '../../../common/hooks/useProject'
import { useRecentProjectOperations } from '../../../common/hooks/useRecentProjectOperations'
import { isDefined } from '../../../common/utils/isDefined'
import { useWebRecentProjects } from '../../hooks/useWebRecentProjects'
import { WebEditorContent } from '../WebEditorContent'

export const WebProjectIndexRoute: FC = () => {
  const { project } = useProject()
  const recentProjects = useWebRecentProjects()
  const { markOpened } = useRecentProjectOperations()
  const recentProject = recentProjects.find((candidate) => candidate.id === project.id)

  useEffect(() => {
    if (project.subProjects.length !== 0) {
      return
    }

    markOpened(project.id)
  }, [markOpened, project.id, project.subProjects.length])

  if (project.subProjects.length > 0) {
    if (isDefined(recentProject)) {
      return <Navigate replace to={recentProject.link} />
    }

    return <Navigate replace to={project.subProjects[0].id} />
  }

  return <WebEditorContent subProjectId={undefined} />
}
