import { Box, Spinner, Stack } from '@chakra-ui/react'
import type { FC } from 'react'

import { useElectronRecentProjects } from '../../hooks/useElectronRecentProjects'
import { Loadable } from '../../loadable'
import { ProjectManagementHeader } from './ProjectManagementHeader'
import { RecentProjects } from './RecentProjects'

export const ElectronProjects: FC = () => {
  const recentProjects = useElectronRecentProjects()

  return (
    <Box bg="bg.emphasized" height="100%" padding="8">
      <Stack align="center" height="100%" justify="center">
        <Stack gap="4" maxWidth="lg" width="100%">
          <ProjectManagementHeader />
          {Loadable.hasValue(recentProjects) ? (
            <RecentProjects projects={recentProjects.data} mode="action" />
          ) : (
            <Spinner alignSelf="center" />
          )}
        </Stack>
      </Stack>
    </Box>
  )
}
