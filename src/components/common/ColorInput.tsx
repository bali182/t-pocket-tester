import { ColorPicker, IconButton, Input, InputGroup, Portal } from '@chakra-ui/react'
import { useMemo, type FC } from 'react'
import { PiArrowCounterClockwise } from 'react-icons/pi'

import type { IssueSchema } from '../../schemas/validation'
import { isDefined } from '../../utils/isDefined'
import { useColorPickerValue } from './useColorPickerValue'

type ColorInputProps = {
  fieldSizing?: 'content' | 'fixed'
  isResetEnabled?: boolean
  issue: IssueSchema | undefined
  onChange: (value: string) => void
  onReset?: () => void
  value: string
}

type ColorPickerPositioning = {
  placement: 'bottom-start'
}

export const ColorInput: FC<ColorInputProps> = ({ fieldSizing, isResetEnabled, issue, onChange, onReset, value }) => {
  const isContentSized = fieldSizing === 'content'
  const positioning = useMemo<ColorPickerPositioning>(
    () => ({
      placement: 'bottom-start',
    }),
    [],
  )
  const { handleOpenChange, handleValueChange, isPickerOpen, pickerColor, pickerColorValue } = useColorPickerValue(
    value,
    onChange,
  )
  const isInvalid = isDefined(issue) && issue.severity === 'error'

  return (
    <ColorPicker.Root
      format="hsba"
      onOpenChange={handleOpenChange}
      onValueChange={handleValueChange}
      positioning={positioning}
      size="xs"
      value={pickerColor}
    >
      <ColorPicker.Control>
        <InputGroup
          endAddon={
            isDefined(onReset) ? (
              <IconButton
                alignSelf="stretch"
                borderRadius="0"
                disabled={!isResetEnabled}
                height="auto"
                onClick={onReset}
                size="xs"
                variant="plain"
              >
                <PiArrowCounterClockwise />
              </IconButton>
            ) : undefined
          }
          endAddonProps={{ px: 0, size: 'xs' }}
          startAddon={
            <ColorPicker.Trigger
              alignItems="center"
              alignSelf="stretch"
              border="0"
              borderRadius="0"
              display="flex"
              height="auto"
              justifyContent="center"
              p="0"
              unstyled
            >
              <ColorPicker.ValueSwatch />
            </ColorPicker.Trigger>
          }
          startAddonProps={{ px: '1.5', size: 'xs' }}
          w={isContentSized ? 'auto' : undefined}
        >
          <Input
            aria-invalid={isInvalid}
            fieldSizing={fieldSizing}
            onChange={(event) => onChange(event.currentTarget.value)}
            size="xs"
            value={isPickerOpen ? pickerColorValue : value}
            w={isContentSized ? 'auto' : undefined}
          />
        </InputGroup>
      </ColorPicker.Control>
      <Portal>
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
      </Portal>
    </ColorPicker.Root>
  )
}
