import { Menu, Text } from '@chakra-ui/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useMemo, type FC, type ReactElement } from 'react'

import { useComponentIcon } from '../hooks/useComponentIcon'
import type { ComponentSchema } from '../schemas/components'
import { projectAtom } from '../state'
import { createStitchLine } from '../utils/createStitchLine'

type AddStitchLineMenuProps = {
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

export const AddStitchLineMenu: FC<AddStitchLineMenuProps> = ({ trigger }) => {
  const project = useAtomValue(projectAtom)
  const setProject = useSetAtom(projectAtom)
  const components = useMemo<ComponentSchema[]>(() => Object.values(project.components), [project.components])

  const handleComponentSelect = useCallback(
    (componentId: string): void => {
      setProject((project) => ({
        ...project,
        stitchLines: [...project.stitchLines, createStitchLine(project, { componentId })],
      }))
    },
    [setProject],
  )

  return (
    <Menu.Root>
      <Menu.Trigger asChild>{trigger}</Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content maxHeight="400px" overflowY="auto">
          {components.map((component) => (
            <ComponentMenuItem component={component} key={component.id} onSelect={handleComponentSelect} />
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}
