import { Button, HStack, Tabs } from '@chakra-ui/react'
import { type FC } from 'react'
import { useNavigate, useParams } from 'react-router'

import { useProject } from '../hooks/useProject'
import { CreateSubProjectDialog } from './CreateSubProjectDialog'
import { SubProjectRouteParams } from '../schemas/routeParams'

export const EditorSubProjectTabs: FC = () => {
  const { project } = useProject()
  const navigate = useNavigate()
  const { subProjectId } = useParams<SubProjectRouteParams>()

  const handleSubProjectClick = (nextSubProjectId: string): void => {
    navigate(`/projects/${project.id}/${nextSubProjectId}`)
  }

  return (
    <Tabs.Root size="sm" value={subProjectId} variant="line" width="100%">
      <Tabs.List>
        {project.subProjects.map((subProject) => (
          <HStack gap="0" key={subProject.id}>
            <Tabs.Trigger onClick={() => handleSubProjectClick(subProject.id)} value={subProject.id}>
              {subProject.name}
            </Tabs.Trigger>
          </HStack>
        ))}
        <CreateSubProjectDialog trigger={<Button size="xs">+</Button>} />
      </Tabs.List>
    </Tabs.Root>
  )
}
