import { Button, HStack, Tabs } from '@chakra-ui/react'
import { type FC } from 'react'
import { Link, useParams } from 'react-router'

import { useProject } from '../hooks/useProject'
import { CreateSubProjectDialog } from './CreateSubProjectDialog'

export const EditorSubProjectTabs: FC = () => {
  const { project } = useProject()
  const { subProjectId } = useParams()

  return (
    <Tabs.Root size="sm" value={subProjectId} variant="line" width="100%">
      <Tabs.List>
        {project.subProjects.map((subProject) => (
          <HStack gap="0" key={subProject.id}>
            <Tabs.Trigger asChild value={subProject.id}>
              <Link to={`/projects/${project.id}/${subProject.id}`}>{subProject.name}</Link>
            </Tabs.Trigger>
          </HStack>
        ))}
        <CreateSubProjectDialog trigger={<Button size="xs">+</Button>} />
      </Tabs.List>
    </Tabs.Root>
  )
}
