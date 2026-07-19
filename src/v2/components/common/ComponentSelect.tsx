import {
  HStack,
  Select,
  Text,
  createListCollection,
  type ListCollection,
  type SelectValueChangeDetails,
} from '@chakra-ui/react'
import { useCallback, useMemo, type FC } from 'react'

import { useComponentIcon } from '../../hooks/useComponentIcon'
import { useProject } from '../../hooks/useProject'
import type { ComponentSchema } from '../../schemas/components'
import { isDefined } from '../../utils/isDefined'

type ComponentSelectProps = {
  componentId: string | undefined
  componentTypes?: ComponentSchema['type'][]
  onChange: (componentId: string) => void
}

export const ComponentSelect: FC<ComponentSelectProps> = ({ componentId, componentTypes, onChange }) => {
  const { project } = useProject()
  const component = isDefined(componentId) ? project.components[componentId] : undefined
  const Icon = useComponentIcon(component?.type ?? 'panel')
  const collection = useMemo<ListCollection<ComponentSchema>>(
    () =>
      createListCollection<ComponentSchema>({
        itemToString: (item) => item.name,
        itemToValue: (item) => item.id,
        items: Object.values(project.components).filter(
          (component) => !isDefined(componentTypes) || componentTypes.includes(component.type),
        ),
      }),
    [componentTypes, project.components],
  )

  const handleValueChange = useCallback(
    (details: SelectValueChangeDetails<ComponentSchema>): void => {
      const nextComponentId = details.value[0]

      if (!isDefined(nextComponentId)) {
        return
      }

      onChange(nextComponentId)
    },
    [onChange],
  )

  return (
    <Select.Root
      collection={collection}
      onValueChange={handleValueChange}
      size="xs"
      value={isDefined(componentId) ? [componentId] : []}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          {isDefined(component) ? (
            <Select.ValueText asChild>
              <HStack gap="1">
                <Icon />
                <Text>{component.name}</Text>
                <Text color="fg.muted">(#{component.id})</Text>
              </HStack>
            </Select.ValueText>
          ) : (
            <Select.ValueText placeholder="Komponens kiválasztása" />
          )}
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content maxHeight="400px" overflowY="auto">
          {collection.items.map((item) => (
            <ComponentSelectItem component={item} key={item.id} />
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  )
}

type ComponentSelectItemProps = {
  component: ComponentSchema
}

const ComponentSelectItem: FC<ComponentSelectItemProps> = ({ component }) => {
  const Icon = useComponentIcon(component.type)

  return (
    <Select.Item item={component}>
      <Icon />
      <Select.ItemText>{component.name}</Select.ItemText>
      <Text color="fg.muted">(#{component.id})</Text>
      <Select.ItemIndicator />
    </Select.Item>
  )
}
