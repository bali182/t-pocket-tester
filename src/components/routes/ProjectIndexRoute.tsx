import { Button, EmptyState } from '@chakra-ui/react'
import type { FC } from 'react'
import { PiPlus } from 'react-icons/pi'
import { Navigate } from 'react-router'

import { useCreateSubProject } from '../../hooks/useCreateSubProject'
import { useProject } from '../../hooks/useProject'
import { useTranslation } from '../../translations/translation'

export const ProjectIndexRoute: FC = () => {
  const { project } = useProject()
  const { createSubProject } = useCreateSubProject()
  const t = useTranslation()

  if (project.subProjects.length > 0) {
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
