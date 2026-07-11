import { Button, HStack, Menu } from '@chakra-ui/react'
import { type FC } from 'react'
import { PiPlus, PiTrash } from 'react-icons/pi'

import { isDefined } from '../../utils/isDefined'
import { AddChildComponentMenu, type ChildComponentType } from '../AddChildComponentMenu'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'

type ToolbarSectionProps = {
  onAddChild?: (type: ChildComponentType) => void
  onRemoveComponent?: () => void
}

export const ToolbarSection: FC<ToolbarSectionProps> = ({ onAddChild, onRemoveComponent }) => {
  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="Akciók">
          <HStack gap="1" justify="end">
            {isDefined(onAddChild) && (
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button size="xs" variant="outline">
                    <PiPlus />
                    Elem hozzáadása
                  </Button>
                </Menu.Trigger>
                <Menu.Positioner>
                  <Menu.Content>
                    <AddChildComponentMenu onAddChild={onAddChild} />
                  </Menu.Content>
                </Menu.Positioner>
              </Menu.Root>
            )}
            {isDefined(onRemoveComponent) && (
              <Button onClick={onRemoveComponent} size="xs" variant="outline">
                <PiTrash />
                Törlés
              </Button>
            )}
          </HStack>
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
