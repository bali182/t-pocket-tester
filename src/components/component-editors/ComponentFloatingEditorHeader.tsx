import { Color, ColorPicker, ColorPickerValueChangeDetails, IconButton, Portal, parseColor } from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react'
import type { IconType } from 'react-icons'
import { PiArrowCounterClockwise } from 'react-icons/pi'

import type { BaseComponentSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { isDefined } from '../../utils/isDefined'
import { EditableFloatingEditorHeader } from '../common/EditableFloatingEditorHeader'

type ComponentFloatingEditorHeaderProps<T extends BaseComponentSchema> = {
  baseColor: string
  editable: EditableSchema<T>
  icon: IconType
  issues: ValidationIssuesSchema<T>
  menu: ReactElement
  onChange: (updated: EditableSchema<T>) => void
  onResetColor: () => void
}

const getColor = (value: string): Color | undefined => {
  try {
    return parseColor(value)
  } catch {
    return undefined
  }
}

export const ComponentFloatingEditorHeader = <T extends BaseComponentSchema>({
  baseColor,
  editable,
  icon,
  issues,
  menu,
  onChange,
  onResetColor,
}: ComponentFloatingEditorHeaderProps<T>) => {
  const effectiveColor = editable.color ?? baseColor
  const parsedColor = useMemo<Color | undefined>(() => getColor(effectiveColor), [effectiveColor])
  const [pickerColor, setPickerColor] = useState<Color>(() => parsedColor ?? parseColor('#000000'))
  const hasColorError = isDefined(issues.color) && issues.color.severity === 'error'

  useEffect(() => {
    if (isDefined(parsedColor)) {
      setPickerColor(parsedColor)
    }
  }, [parsedColor])

  const handleNameChange = useCallback(
    (name: string) => {
      onChange({ ...editable, name })
    },
    [editable, onChange],
  )

  const handleColorChange = useCallback(
    (details: ColorPickerValueChangeDetails) => {
      const nextColor = details.value
      const nextValue =
        nextColor.getChannelValue('alpha') === 1 ? nextColor.toString('hex') : nextColor.toString('hexa')

      onChange({ ...editable, color: nextValue })
    },
    [editable, onChange],
  )

  return (
    <EditableFloatingEditorHeader
      icon={icon}
      menu={menu}
      name={editable.name}
      nameIssue={issues.name}
      onNameChange={handleNameChange}
      rightAddon={
        <ColorPicker.Root
          onValueChange={handleColorChange}
          positioning={{ placement: 'bottom-end' }}
          size="xs"
          value={pickerColor}
        >
          <ColorPicker.Control>
            <ColorPicker.Trigger
              aria-invalid={hasColorError}
              borderColor={hasColorError ? 'border.error' : 'transparent'}
              borderRadius="l2"
              borderWidth="1px"
              focusRing="inside"
              focusRingColor="colorPalette.focusRing"
              p="1"
            >
              <ColorPicker.ValueSwatch boxSize="4" />
            </ColorPicker.Trigger>
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
                <ColorPicker.Input />
                <IconButton disabled={!isDefined(editable.color)} onClick={onResetColor} size="xs" variant="plain">
                  <PiArrowCounterClockwise />
                </IconButton>
              </ColorPicker.Content>
            </ColorPicker.Positioner>
          </Portal>
        </ColorPicker.Root>
      }
    />
  )
}
