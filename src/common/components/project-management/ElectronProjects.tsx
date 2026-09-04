import { Box, Button, HStack, Spinner, Stack } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'

import { PiFolder, PiPlus } from 'react-icons/pi'
import { useElectronProject } from '../../hooks/useElectronProject'
import { useElectronRecentProjects } from '../../hooks/useElectronRecentProjects'
import { Loadable } from '../../loadable'
import type { RecentProjectVisualisationSchema } from '../../schemas/recentProject'
import { useTranslation } from '../../translations/translation'
import { ProjectManagementHeader } from './ProjectManagementHeader'
import { RecentProjects } from './RecentProjects'

export const ElectronProjects: FC = () => {
  const recentProjects = useElectronRecentProjects()
  const { loadProject, openProject } = useElectronProject()
  const t = useTranslation()

  const handleRecentProjectOpen = useCallback(
    async (project: RecentProjectVisualisationSchema): Promise<void> => {
      await loadProject(project.path, project.subProjectId)
    },
    [loadProject],
  )

  return (
    <Box bg="bg.emphasized" height="100%" padding="8">
      <Stack align="center" height="100%" justify="center">
        <Stack gap="4" maxWidth="lg" width="100%">
          <ProjectManagementHeader />
          {Loadable.hasValue(recentProjects) ? (
            <RecentProjects onOpen={handleRecentProjectOpen} projects={recentProjects.data} mode="electron">
              <HStack gap="2" mt="2">
                <Button disabled width="100%" variant="solid" display="flex" flex="1">
                  <PiPlus />
                  {t.projects.actions.create}
                </Button>
                <Button onClick={openProject} width="100%" variant="subtle" display="flex" flex="1">
                  <PiFolder />
                  {t.projects.actions.open}
                </Button>
              </HStack>
            </RecentProjects>
          ) : (
            <Spinner alignSelf="center" />
          )}
        </Stack>
      </Stack>
    </Box>
  )
}
