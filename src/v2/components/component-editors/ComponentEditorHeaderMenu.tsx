import { Button, HStack, Menu } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'
import { PiPlus, PiTrash } from 'react-icons/pi'

import { type ChildComponentType, AddChildComponentMenu } from '../AddChildComponentMenu'
import { useProject } from '../../hooks/useProject'
import type { ComponentSchema } from '../../schemas/components'

type ComponentEditorHeaderMenuProps = {
  component: ComponentSchema
  onClose: () => void
}

export const ComponentEditorHeaderMenu: FC<ComponentEditorHeaderMenuProps> = ({ component, onClose }) => {
  const { addComponent, deleteComponent } = useProject()
  const canAddChild = component.type !== 'pocket-cluster'
  const canDelete = component.type !== 'root-panel'

  const handleAddChild = useCallback(
    (type: ChildComponentType): void => {
      addComponent(component.id, type)
    },
    [addComponent, component.id],
  )

  const handleDelete = useCallback((): void => {
    onClose()
    deleteComponent(component.id)
  }, [component.id, deleteComponent, onClose])

  return (
    <HStack gap="1">
      {canAddChild && (
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button size="2xs" variant="subtle">
              <PiPlus />
              Elem hozzáadása
            </Button>
          </Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content>
              <AddChildComponentMenu onAddChild={handleAddChild} />
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      )}
      {canDelete && (
        <Button colorPalette="red" onClick={handleDelete} size="2xs" variant="subtle">
          <PiTrash />
          Törlés
        </Button>
      )}
    </HStack>
  )
}
