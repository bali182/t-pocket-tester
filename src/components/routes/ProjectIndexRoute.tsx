import { Button, EmptyState } from '@chakra-ui/react'
import type { FC } from 'react'
import { PiPlus } from 'react-icons/pi'
import { Navigate } from 'react-router'

import { useProject } from '../../hooks/useProject'
import { CreateSubProjectDialog } from '../CreateSubProjectDialog'

export const ProjectIndexRoute: FC = () => {
  const { project } = useProject()

  if (project.subProjects.length > 0) {
    return <Navigate replace to={project.subProjects[0].id} />
  }

  return (
    <EmptyState.Root height="100%">
      <EmptyState.Content>
        <EmptyState.Title>No subprojects yet</EmptyState.Title>
        <EmptyState.Description>Create a subproject to start editing.</EmptyState.Description>
        <CreateSubProjectDialog trigger={<Button><PiPlus />Add project</Button>} />
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
