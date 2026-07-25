import { Box, IconButton, IconButtonProps, Menu, Portal } from '@chakra-ui/react'
import { useCallback, type FC, type MouseEvent } from 'react'
import { PiCopy, PiDotsThreeVertical, PiTrash } from 'react-icons/pi'
import { useProject } from '../hooks/useProject'
import type { ComponentSchema } from '../schemas/components'
import type { StitchLineSchema } from '../schemas/stitching'
import { useTranslation } from '../translations/translation'
import { noop } from '../utils/noop'

type StitchLineActionsMenuProps = {
  stitchLine: StitchLineSchema
  size: IconButtonProps['size']
  onAddChild?: (parentId: string, type: ComponentSchema['type']) => void
  onAddStitchLine?: (componentId: string, type: StitchLineSchema['type']) => void
  onDelete?: (stitchLineId: string) => void
}

export const StitchLineActionsMenu: FC<StitchLineActionsMenuProps> = ({ stitchLine, size, onDelete = noop }) => {
  const t = useTranslation()
  const { cloneStitchLine, deleteStitchLine } = useProject()

  const handleActionsClick = useCallback((event: MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation()
  }, [])

  const handleDelete = useCallback((): void => {
    deleteStitchLine(stitchLine.id)
    onDelete(stitchLine.id)
  }, [deleteStitchLine, stitchLine.id, onDelete])

  const handleClone = useCallback((): void => {
    cloneStitchLine(stitchLine.id)
  }, [cloneStitchLine, stitchLine.id])

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
              <Menu.Item onClick={handleClone} value="clone">
                <PiCopy />
                <Menu.ItemText>{t.common.componentActions.clone}</Menu.ItemText>
              </Menu.Item>
              <Menu.Item
                onClick={handleDelete}
                value="delete"
                color="fg.error"
                _hover={{ bg: 'bg.error', color: 'fg.error' }}
              >
                <PiTrash />
                <Menu.ItemText>{t.common.componentActions.remove}</Menu.ItemText>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Box>
  )
}
