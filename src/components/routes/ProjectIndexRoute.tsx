import { Button, EmptyState } from '@chakra-ui/react'
import { useEffect, type FC } from 'react'
import { PiPlus } from 'react-icons/pi'
import { Navigate } from 'react-router'

import { useCreateSubProject } from '../../hooks/useCreateSubProject'
import { useProject } from '../../hooks/useProject'
import { useRecentProjectOperations } from '../../hooks/useRecentProjectOperations'
import { useRecentProjects } from '../../hooks/useRecentProjects'
import { useTranslation } from '../../translations/translation'
import { isDefined } from '../../utils/isDefined'

export const ProjectIndexRoute: FC = () => {
  const { project } = useProject()
  const { createSubProject } = useCreateSubProject()
  const recentProjects = useRecentProjects()
  const { markProjectOpened } = useRecentProjectOperations()
  const t = useTranslation()
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

  return (
    <EmptyState.Root height="100%">
      <EmptyState.Content>
        <EmptyState.Title>{t.projects.empty.noModules.title}</EmptyState.Title>
        <EmptyState.Description>{t.projects.empty.noModules.description}</EmptyState.Description>
        <Button onClick={createSubProject}>
          <PiPlus />
          {t.projects.actions.createModule}
        </Button>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
