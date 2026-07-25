import { Box, IconButton, IconButtonProps, Menu, Portal } from '@chakra-ui/react'
import { useCallback, type FC, type MouseEvent } from 'react'
import { PiDotsThreeVertical, PiGear, PiTrash } from 'react-icons/pi'
import { useProjects } from '../hooks/useProjects'
import { useTranslation } from '../translations/translation'

type ProjectActionsMenuProps = {
  projectId: string
  size: IconButtonProps['size']
}

export const ProjectActionsMenu: FC<ProjectActionsMenuProps> = ({ size, projectId }) => {
  const t = useTranslation()
  const { deleteProject } = useProjects()

  const handleActionsClick = useCallback((event: MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation()
  }, [])

  const handleSettings = useCallback(() => {
    // TODO open dialog
  }, [])

  const handleDelete = useCallback(() => {
    deleteProject(projectId)
    // Navigate back to /projects.
  }, [deleteProject, projectId])

  return (
    <Box onClick={handleActionsClick}>
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton size={size} variant="ghost">
            <PiDotsThreeVertical />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item onClick={handleSettings} value="settings">
                <PiGear />
                <Menu.ItemText>{t.common.actions.settings}</Menu.ItemText>
              </Menu.Item>
              <Menu.Item
                onClick={handleDelete}
                value="delete"
                color="fg.error"
                _hover={{ bg: 'bg.error', color: 'fg.error' }}
              >
                <PiTrash />
                <Menu.ItemText>{t.common.actions.remove}</Menu.ItemText>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Box>
  )
}
