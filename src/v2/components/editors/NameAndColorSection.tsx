import { Button, ColorPicker, Input, Text, parseColor } from '@chakra-ui/react'
import { useCallback, useMemo, type ChangeEvent, type ReactNode } from 'react'

import { BaseComponentSchema } from '../../schemas/components'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'

type NameAndColorSectionProps<T> = {
  editable: T
  onChange: (updated: T) => void
}

export function NameAndColorSection<T extends BaseComponentSchema>({
  editable,
  onChange,
}: NameAndColorSectionProps<T>): ReactNode {
  const color = useMemo(() => parseColor(editable.color), [editable.color])

  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...editable,
        name: event.target.value,
      })
    },
    [editable, onChange],
  )

  const handleColorChange = useCallback<NonNullable<ColorPicker.RootProps['onValueChange']>>(
    (details) => {
      const color = details.value
      const nextColor = color.getChannelValue('alpha') === 1 ? color.toString('hex') : color.toString('hexa')

      onChange({
        ...editable,
        color: nextColor,
      })
    },
    [editable, onChange],
  )

  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="Név">
          <Input onChange={handleNameChange} size="xs" value={editable.name} />
        </EditorFieldRow>

        <EditorFieldRow label="Szín">
          <ColorPicker.Root onValueChange={handleColorChange} size="xs" value={color}>
            <ColorPicker.Control>
              <ColorPicker.Trigger asChild>
                <Button aria-label="Szín kiválasztása" justifyContent="start" minWidth="0" size="xs" variant="outline" width="100%">
                  <ColorPicker.ValueSwatch />
                  <Text truncate>{editable.color}</Text>
                </Button>
              </ColorPicker.Trigger>
            </ColorPicker.Control>
            <ColorPicker.Positioner>
              <ColorPicker.Content>
                <ColorPicker.Area>
                  <ColorPicker.AreaBackground />
                  <ColorPicker.AreaThumb />
                </ColorPicker.Area>
                <ColorPicker.ChannelSlider channel="hue">
                  <ColorPicker.ChannelSliderTrack />
                  <ColorPicker.ChannelSliderThumb />
                </ColorPicker.ChannelSlider>
                <ColorPicker.ChannelSlider channel="alpha">
                  <ColorPicker.ChannelSliderTrack />
                  <ColorPicker.ChannelSliderThumb />
                </ColorPicker.ChannelSlider>
              </ColorPicker.Content>
            </ColorPicker.Positioner>
          </ColorPicker.Root>
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
