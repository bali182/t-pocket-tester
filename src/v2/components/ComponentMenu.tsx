import { Menu, Text } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import { useCallback, useMemo, type FC, type ReactElement } from 'react'

import { useComponentIcon } from '../hooks/useComponentIcon'
import type { ComponentSchema } from '../schemas/components'
import { projectAtom } from '../state/projectAtom'

type ComponentMenuProps = {
  onSelect: (componentId: string) => void
  trigger: ReactElement
}

type ComponentMenuItemProps = {
  component: ComponentSchema
  onSelect: (componentId: string) => void
}

const ComponentMenuItem: FC<ComponentMenuItemProps> = ({ component, onSelect }) => {
  const Icon = useComponentIcon(component.type)

  const handleClick = useCallback((): void => {
    onSelect(component.id)
  }, [component.id, onSelect])

  return (
    <Menu.Item value={component.id} onClick={handleClick}>
      <Icon />
      <Menu.ItemText>{component.name}</Menu.ItemText>
      <Text color="fg.muted">(#{component.id})</Text>
    </Menu.Item>
  )
}

export const ComponentMenu: FC<ComponentMenuProps> = ({ onSelect, trigger }) => {
  const project = useAtomValue(projectAtom)
  const components = useMemo<ComponentSchema[]>(() => Object.values(project.components), [project.components])

  return (
    <Menu.Root>
      <Menu.Trigger asChild>{trigger}</Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content maxHeight="400px" overflowY="auto">
          {components.map((component) => (
            <ComponentMenuItem component={component} key={component.id} onSelect={onSelect} />
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}
