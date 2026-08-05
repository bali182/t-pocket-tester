import { Box, IconButton, Menu, Portal, type IconButtonProps } from '@chakra-ui/react'
import { useCallback, type FC, type MouseEvent } from 'react'
import { PiCopy, PiDotsThreeVertical, PiNeedle, PiTrash } from 'react-icons/pi'
import { useSubProject } from '../../hooks/useSubProject'
import type { HoleSchema } from '../../schemas/hole'
import { useTranslation } from '../../translations/translation'
import { noop } from '../../utils/noop'

type HoleActionsMenuProps = {
  hole: HoleSchema
  size: IconButtonProps['size']
  onDelete?: (holeId: string) => void
}

export const HoleActionsMenu: FC<HoleActionsMenuProps> = ({ hole, size, onDelete = noop }) => {
  const t = useTranslation()
  const { addStitchLineToHole, cloneHole, deleteHole } = useSubProject()

  const handleClick = useCallback((event: MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation()
  }, [])

  const handleAddStitchLine = useCallback((): void => {
    addStitchLineToHole(hole.id)
  }, [addStitchLineToHole, hole.id])

  const handleClone = useCallback((): void => {
    cloneHole(hole.id)
  }, [cloneHole, hole.id])

  const handleDelete = useCallback((): void => {
    deleteHole(hole.id)
    onDelete(hole.id)
  }, [deleteHole, hole.id, onDelete])

  return (
    <Box onClick={handleClick}>
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton size={size} variant="ghost">
            <PiDotsThreeVertical />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item onClick={handleAddStitchLine} value="stitch-line">
                <PiNeedle />
                <Menu.ItemText>{t.common.actions.addByName(t.stitchLine.types.componentBounds)}</Menu.ItemText>
              </Menu.Item>
              <Menu.Separator />
              <Menu.Item onClick={handleClone} value="clone">
                <PiCopy />
                <Menu.ItemText>{t.common.actions.clone}</Menu.ItemText>
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
