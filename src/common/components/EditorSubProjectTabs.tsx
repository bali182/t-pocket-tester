import { HStack, IconButton, Tabs } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'
import { useNavigate, useParams } from 'react-router'

import { PiPlus, PiWalletDuotone } from 'react-icons/pi'
import { appRoutes } from '../appRoutes'
import { useProject } from '../hooks/useProject'
import { useProjectOperations } from '../hooks/useProjectOperations'
import { SubProjectRouteParams } from '../schemas/routeParams'
import { accessors } from '../utils/accessors'
import { ComponentActionsMenu } from './ComponentActionsMenu'

export const EditorSubProjectTabs: FC = () => {
  const { project } = useProject()
  const { createSubProject } = useProjectOperations()
  const navigate = useNavigate()
  const { subProjectId } = useParams<SubProjectRouteParams>()

  const handleSubProjectClick = useCallback(
    (subProjectId: string): void => {
      navigate(appRoutes.subProject(project.id, subProjectId))
    },
    [navigate, project.id],
  )

  const handleCreateSubProject = useCallback((): void => {
    const subProject = createSubProject()
    navigate(appRoutes.subProject(project.id, subProject.id))
  }, [createSubProject, navigate, project.id])

  return (
    <Tabs.Root size="md" value={subProjectId} variant="outline" width="100%">
      <Tabs.List _before={{ borderBottomColor: 'bg.panel' }} alignItems="center">
        {project.subProjects.map((subProject) => {
          const rootPanel = accessors.subProject(subProject).rootPanel()
          return (
            <HStack gap="0" key={subProject.id}>
              <Tabs.Trigger
                as="div"
                _selected={{ bg: 'bg.panel', borderColor: 'bg.panel', boxShadow: 'md' }}
                onClick={() => handleSubProjectClick(subProject.id)}
                pr="2"
                value={subProject.id}
              >
                <PiWalletDuotone /> {rootPanel.name}
                <ComponentActionsMenu size="2xs" component={rootPanel} subProjectOnly={true} subProject={subProject} />
              </Tabs.Trigger>
            </HStack>
          )
        })}
        <IconButton size="xs" variant="ghost" ml="2" onClick={handleCreateSubProject}>
          <PiPlus />
        </IconButton>
      </Tabs.List>
    </Tabs.Root>
  )
}
