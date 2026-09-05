import { Box, Button, HStack, Spinner, Stack } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'
import { PiFolder, PiPlus } from 'react-icons/pi'

import { ProjectManagementHeader } from '../../../common/components/project-management/ProjectManagementHeader'
import { RecentProjects } from '../../../common/components/project-management/RecentProjects'
import { useElectronProject } from '../../../common/hooks/useElectronProject'
import { Loadable } from '../../../common/loadable'
import type { RecentProjectVisualisationSchema } from '../../../common/schemas/recentProject'
import { useTranslation } from '../../../common/translations/translation'
import { useElectronRecentProjects } from '../../hooks/useElectronRecentProjects'
import { ElectronProjectItem } from './ElectronProjectItem'

export const ElectronProjects: FC = () => {
  const recentProjects = useElectronRecentProjects()
  const { openProject } = useElectronProject()
  const t = useTranslation()

  const getProjectSearchText = useCallback((project: RecentProjectVisualisationSchema): string => project.path, [])

  return (
    <Box bg="bg.emphasized" height="100%" padding="8">
      <Stack align="center" height="100%" justify="center">
        <Stack gap="4" maxWidth="lg" width="100%">
          <ProjectManagementHeader />
          {Loadable.hasValue(recentProjects) ? (
            <RecentProjects
              ProjectItem={ElectronProjectItem}
              getProjectSearchText={getProjectSearchText}
              projects={recentProjects.data}
            >
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
