import { HStack, IconButton, Tabs } from '@chakra-ui/react'
import { type FC } from 'react'
import { useNavigate, useParams } from 'react-router'

import { PiPlus } from 'react-icons/pi'
import { useProject } from '../hooks/useProject'
import { SubProjectRouteParams } from '../schemas/routeParams'
import { CreateSubProjectDialog } from './CreateSubProjectDialog'

export const EditorSubProjectTabs: FC = () => {
  const { project } = useProject()
  const navigate = useNavigate()
  const { subProjectId } = useParams<SubProjectRouteParams>()

  const handleSubProjectClick = (nextSubProjectId: string): void => {
    navigate(`/projects/${project.id}/${nextSubProjectId}`)
  }

  return (
    <Tabs.Root size="md" value={subProjectId} variant="outline" width="100%">
      <Tabs.List _before={{ borderBottomColor: 'bg.panel' }} alignItems="center">
        {project.subProjects.map((subProject) => (
          <HStack gap="0" key={subProject.id}>
            <Tabs.Trigger
              _selected={{ bg: 'bg.panel', borderColor: 'bg.panel', boxShadow: 'md' }}
              onClick={() => handleSubProjectClick(subProject.id)}
              value={subProject.id}
            >
              {subProject.name}
            </Tabs.Trigger>
          </HStack>
        ))}
        <CreateSubProjectDialog
          trigger={
            <IconButton size="xs" variant="ghost" ml="2">
              <PiPlus />
            </IconButton>
          }
        />
      </Tabs.List>
    </Tabs.Root>
  )
}
