import { Button, HStack, Menu, Popover, Text } from '@chakra-ui/react'
import { type FC } from 'react'
import { PiPlus, PiTrash } from 'react-icons/pi'

import { isDefined } from '../../utils/isDefined'
import { AddChildComponentMenu, type ChildComponentType } from '../AddChildComponentMenu'

type FloatingEditorHeaderProps = {
  componentId: string
  onAddChild?: (type: ChildComponentType) => void
  onRemoveComponent?: () => void
}

export const FloatingEditorHeader: FC<FloatingEditorHeaderProps> = ({ componentId, onAddChild, onRemoveComponent }) => {
  return (
    <Popover.Header p="0">
      <HStack justify="space-between" pl="4" pr="4" pt="3" pb="3">
        <Text fontWeight="semibold" textStyle="xs">
          #{componentId}
        </Text>
        <HStack gap="1">
          {isDefined(onAddChild) && (
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button size="2xs" variant="subtle">
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
            <Button colorPalette="red" onClick={onRemoveComponent} size="2xs" variant="subtle">
              <PiTrash />
              Törlés
            </Button>
          )}
        </HStack>
      </HStack>
    </Popover.Header>
  )
}
