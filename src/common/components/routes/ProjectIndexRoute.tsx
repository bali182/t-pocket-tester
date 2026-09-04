import { useEffect, type FC } from 'react'
import { Navigate } from 'react-router'

import { useProject } from '../../hooks/useProject'
import { useRecentProjectOperations } from '../../hooks/useRecentProjectOperations'
import { useRecentProjects } from '../../hooks/useRecentProjects'
import { isDefined } from '../../utils/isDefined'
import { EditorContent } from '../EditorContent'

export const ProjectIndexRoute: FC = () => {
  const { project } = useProject()
  const recentProjects = useRecentProjects()
  const { markProjectOpened } = useRecentProjectOperations()
  const recentProject = recentProjects.find((candidate) => candidate.projectId === project.id)

  useEffect(() => {
    if (project.subProjects.length !== 0) {
      return
    }

    markProjectOpened(project.id)
  }, [markProjectOpened, project.id, project.subProjects.length])

  if (project.subProjects.length > 0) {
    if (isDefined(recentProject)) {
      return <Navigate replace to={recentProject.link} />
    }

    return <Navigate replace to={project.subProjects[0].id} />
  }

  return <EditorContent subProjectId={undefined} />
}
