import { HStack, IconButton, Tabs } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'
import { useNavigate, useParams } from 'react-router'

import { PiPlus, PiWallet } from 'react-icons/pi'
import { appRoutes } from '../appRoutes'
import { useCreateSubProject } from '../hooks/useCreateSubProject'
import { useProject } from '../hooks/useProject'
import { SubProjectRouteParams } from '../schemas/routeParams'

export const EditorSubProjectTabs: FC = () => {
  const { project } = useProject()
  const { createSubProject } = useCreateSubProject()
  const navigate = useNavigate()
  const { subProjectId } = useParams<SubProjectRouteParams>()

  const handleSubProjectClick = useCallback(
    (subProjectId: string): void => {
      navigate(appRoutes.subProject(project.id, subProjectId))
    },
    [navigate, project.id],
  )

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
              <PiWallet /> {subProject.components[subProject.root]?.name}
            </Tabs.Trigger>
          </HStack>
        ))}
        <IconButton size="xs" variant="ghost" ml="2" onClick={createSubProject}>
          <PiPlus />
        </IconButton>
      </Tabs.List>
    </Tabs.Root>
  )
}
