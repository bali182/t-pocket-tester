import { Button, HStack, Menu } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'
import { PiPlus, PiTrash } from 'react-icons/pi'

import { useProject } from '../../hooks/useProject'
import type { ComponentSchema } from '../../schemas/components'
import { useTranslation } from '../../translations/translation'
import { AddChildComponentMenu, type ChildComponentType } from '../AddChildComponentMenu'

type ComponentEditorHeaderMenuProps = {
  component: ComponentSchema
  onClose: () => void
}

export const ComponentEditorHeaderMenu: FC<ComponentEditorHeaderMenuProps> = ({ component, onClose }) => {
  const t = useTranslation()
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
              {t.component.editor.actions.addChild}
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
          {t.common.actions.remove}
        </Button>
      )}
    </HStack>
  )
}
