import { Button, HStack, Menu } from '@chakra-ui/react'
import { useSetAtom } from 'jotai'
import { useCallback, type FC } from 'react'
import { PiPlus, PiTrash } from 'react-icons/pi'

import { type ChildComponentType, AddChildComponentMenu } from '../AddChildComponentMenu'
import type { ComponentSchema } from '../../schemas/components'
import { projectAtom } from '../../state/state'
import { addComponent } from '../../utils/addComponent'
import { removeComponent } from '../../utils/removeComponent'

type ComponentEditorHeaderMenuProps = {
  component: ComponentSchema
  onClose: () => void
}

export const ComponentEditorHeaderMenu: FC<ComponentEditorHeaderMenuProps> = ({ component, onClose }) => {
  const setProject = useSetAtom(projectAtom)
  const canAddChild = component.type !== 'pocket-cluster'
  const canDelete = component.type !== 'root-panel'

  const handleAddChild = useCallback(
    (type: ChildComponentType): void => {
      setProject((project) => addComponent(component.id, type, project))
    },
    [component.id, setProject],
  )

  const handleDelete = useCallback((): void => {
    onClose()
    setProject((project) => removeComponent(component.id, project))
  }, [component.id, onClose, setProject])

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
