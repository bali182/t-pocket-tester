import { Box, Button, Stack } from '@chakra-ui/react'
import { useCallback, useState, type FC } from 'react'
import { PiPlus } from 'react-icons/pi'

import { ProjectManagementHeader } from '../../../common/components/project-management/ProjectManagementHeader'
import { RecentProjects } from '../../../common/components/project-management/RecentProjects'
import type { RecentProjectVisualisationSchema } from '../../../common/schemas/recentProject'
import { useTranslation } from '../../../common/translations/translation'
import { useRecentProjects } from '../../hooks/useRecentProjects'
import { CreateProjectDialog } from '../CreateProjectDialog'
import { WebProjectItem } from './WebProjectItem'

export const WebProjects: FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const recentProjects = useRecentProjects()
  const t = useTranslation()

  const openCreateDialog = useCallback((): void => {
    setIsCreateDialogOpen(true)
  }, [])

  const getProjectSearchText = useCallback(
    (project: RecentProjectVisualisationSchema): string => project.projectName,
    [],
  )

  return (
    <Box bg="bg.emphasized" height="100%" padding="8">
      <Stack align="center" height="100%" justify="center">
        <Stack gap="4" maxWidth="lg" width="100%">
          <ProjectManagementHeader />
          <RecentProjects
            ProjectItem={WebProjectItem}
            getProjectSearchText={getProjectSearchText}
            projects={recentProjects}
          >
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
