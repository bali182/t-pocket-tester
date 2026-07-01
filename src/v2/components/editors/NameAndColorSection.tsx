import { Card, ColorPicker, Input, parseColor, type ColorPickerValueChangeDetails } from '@chakra-ui/react'
import { useCallback, type ChangeEvent, type ReactNode } from 'react'

import { BaseComponentSchema } from '../../schemas/components'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'

type NameAndColorSectionProps<T> = {
  component: T
  onChange: (updated: T) => void
}

export function NameAndColorSection<T extends BaseComponentSchema>({
  component,
  onChange,
}: NameAndColorSectionProps<T>): ReactNode {
  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...component,
        name: event.target.value,
      })
    },
    [component, onChange],
  )

  const handleColorChange = useCallback(
    (details: ColorPickerValueChangeDetails) => {
      onChange({
        ...component,
        color: details.value.toString('hex'),
      })
    },
    [component, onChange],
  )

  return (
    <Card.Body borderTopWidth="1px" gap="2" paddingBlock="3" paddingInline="3">
      <EditorFieldGrid>
        <EditorFieldRow label="Name">
          <Input onChange={handleNameChange} size="xs" value={component.name} />
        </EditorFieldRow>

        <EditorFieldRow label="Color">
          <ColorPicker.Root
            format="rgba"
            onValueChange={handleColorChange}
            positioning={{ placement: 'bottom-end' }}
            value={parseColor(component.color)}
          >
            <ColorPicker.Control>
              <ColorPicker.Trigger>
                <ColorPicker.ValueSwatch />
              </ColorPicker.Trigger>
              <ColorPicker.Input />
            </ColorPicker.Control>
            <ColorPicker.Positioner>
              <ColorPicker.Content>
                <ColorPicker.Area />
                <ColorPicker.ChannelSlider channel="hue" />
              </ColorPicker.Content>
            </ColorPicker.Positioner>
          </ColorPicker.Root>
        </EditorFieldRow>
      </EditorFieldGrid>
    </Card.Body>
  )
}
