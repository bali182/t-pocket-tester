import {
  Color,
  ColorPicker,
  ColorPickerValueChangeDetails,
  IconButton,
  Input,
  InputGroup,
  parseColor,
} from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useRef, useState, type FC } from 'react'
import { PiArrowCounterClockwise } from 'react-icons/pi'

import type { IssueSchema } from '../../schemas/validation'
import { isDefined } from '../../utils/isDefined'

type ColorInputProps = {
  isResetEnabled?: boolean
  issue: IssueSchema | undefined
  onChange: (value: string) => void
  onReset?: () => void
  value: string
}

const getColor = (value: string): Color | undefined => {
  try {
    return parseColor(value)
  } catch {
    return undefined
  }
}

export const ColorInput: FC<ColorInputProps> = ({ isResetEnabled, issue, onChange, onReset, value }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const parsedColor = useMemo<Color | undefined>(() => getColor(value), [value])
  const [pickerColor, setPickerColor] = useState<Color>(() => parsedColor ?? parseColor('#000000'))
  const [isOpen, setOpen] = useState(false)
  const isInvalid = isDefined(issue) && issue.severity === 'error'

  useEffect(() => {
    if (isDefined(parsedColor)) {
      setPickerColor(parsedColor)
    }
  }, [parsedColor])

  const handleOpenColorPicker = useCallback((): void => {
    setOpen(true)
  }, [])

  const handleOpenChange = useCallback((details: { open: boolean }): void => {
    setOpen(details.open)
  }, [])

  const handleValueChange = useCallback(
    (details: ColorPickerValueChangeDetails) => {
      const nextColor = details.value
      const nextValue =
        nextColor.getChannelValue('alpha') === 1 ? nextColor.toString('hex') : nextColor.toString('hexa')

      onChange(nextValue)
    },
    [onChange],
  )

  return (
    <ColorPicker.Root
      onOpenChange={handleOpenChange}
      onValueChange={handleValueChange}
      open={isOpen}
      openAutoFocus={false}
      positioning={{ getAnchorElement: () => inputRef.current }}
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
          startAddon={<ColorPicker.ValueSwatch onClick={handleOpenColorPicker} />}
          startAddonProps={{ px: '1.5', size: 'xs' }}
        >
          <Input
            aria-invalid={isInvalid}
            onChange={(event) => onChange(event.currentTarget.value)}
            onFocus={handleOpenColorPicker}
            ref={inputRef}
            size="xs"
            value={value}
          />
        </InputGroup>
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
  )
}
