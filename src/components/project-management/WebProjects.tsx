import { Box, Button, Stack } from '@chakra-ui/react'
import { useCallback, useState, type FC } from 'react'
import { PiPlus } from 'react-icons/pi'

import { useRecentProjects } from '../../hooks/useRecentProjects'
import { useTranslation } from '../../translations/translation'
import { CreateProjectDialog } from '../CreateProjectDialog'
import { ProjectManagementHeader } from './ProjectManagementHeader'
import { RecentProjects } from './RecentProjects'

export const WebProjects: FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const recentProjects = useRecentProjects()
  const t = useTranslation()

  const openCreateDialog = useCallback((): void => {
    setIsCreateDialogOpen(true)
  }, [])

  return (
    <Box bg="bg.emphasized" height="100%" padding="8">
      <Stack align="center" height="100%" justify="center">
        <Stack gap="4" maxWidth="lg" width="100%">
          <ProjectManagementHeader />
          <RecentProjects projects={recentProjects} mode="link">
            <Button onClick={openCreateDialog} width="100%" mt="2" variant="solid">
              <PiPlus />
              {t.projects.actions.create}
            </Button>
          </RecentProjects>
        </Stack>
      </Stack>

      <CreateProjectDialog isOpen={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </Box>
  )
}
