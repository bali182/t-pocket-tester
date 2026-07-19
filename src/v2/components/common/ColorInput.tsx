import { Button, Color, ColorPicker, ColorPickerValueChangeDetails, Text, parseColor } from '@chakra-ui/react'
import { FC, useCallback, useMemo } from 'react'

import type { IssueSchema } from '../../schemas/validation'
import { isDefined } from '../../utils/isDefined'
import { useTranslation } from '../../translations/translation'

type ColorInputProps = {
  issue: IssueSchema | undefined
  onChange: (value: string) => void
  value: string
}

export const ColorInput: FC<ColorInputProps> = ({ issue, onChange, value }) => {
  const t = useTranslation()
  const color = useMemo<Color>(() => parseColor(value), [value])
  const isInvalid = isDefined(issue) && issue.severity === 'error'

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
    <ColorPicker.Root onValueChange={handleValueChange} size="xs" value={color}>
      <ColorPicker.Control>
        <ColorPicker.Trigger asChild>
          <Button
            aria-invalid={isInvalid}
            aria-label={t.common.accessibility.selectColor()}
            justifyContent="start"
            minWidth="0"
            size="xs"
            variant="outline"
            width="100%"
          >
            <ColorPicker.ValueSwatch />
            <Text truncate>{value}</Text>
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
  )
}
