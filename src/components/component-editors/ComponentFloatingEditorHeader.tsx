import { Button, ColorPicker, HStack, Input, Portal, type ColorPickerValueChangeDetails } from '@chakra-ui/react'
import { useCallback, useMemo, type ReactElement } from 'react'
import type { IconType } from 'react-icons'
import { PiArrowCounterClockwise } from 'react-icons/pi'

import { LEATHER_BASE_COLOR } from '../../constants/drawing'
import type { BaseComponentSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { IssueSchema, ValidationIssuesSchema } from '../../schemas/validation'
import { useTranslation } from '../../translations/translation'
import { isDefined } from '../../utils/isDefined'
import { getColor, getColorValue } from '../common/colorPickerUtils'
import { IdentityFloatingEditorHeader } from '../common/IdentityFloatingEditorHeader'

type ComponentFloatingEditorHeaderProps<T extends BaseComponentSchema> = {
  baseColor: string
  editable: EditableSchema<T>
  icon: IconType
  issues: ValidationIssuesSchema<T>
  menu: ReactElement
  onChange: (updated: EditableSchema<T>) => void
  onResetColor: () => void
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

  const handleColorChange = useCallback(
    (color: string) => {
      onChange({ ...editable, color })
    },
    [editable, onChange],
  )

  return (
    <IdentityFloatingEditorHeader
      editable={editable}
      icon={icon}
      issues={issues}
      menu={menu}
      onChange={onChange}
      rightAddon={
        <HeaderColorInput
          isResetEnabled={isDefined(editable.color)}
          issue={issues.color}
          onChange={handleColorChange}
          onReset={onResetColor}
          value={effectiveColor}
        />
      }
    />
  )
}

type HeaderColorInputProps = {
  isResetEnabled: boolean
  issue: IssueSchema | undefined
  onChange: (value: string) => void
  onReset: () => void
  value: string
}

const HeaderColorInput = ({ isResetEnabled, issue, onChange, onReset, value }: HeaderColorInputProps) => {
  const t = useTranslation()
  const pickerColor = useMemo(() => getColor(value, LEATHER_BASE_COLOR), [value])
  const handleValueChange = useCallback(
    (details: ColorPickerValueChangeDetails): void => {
      onChange(getColorValue(details.value))
    },
    [onChange],
  )
  const isInvalid = isDefined(issue) && issue.severity === 'error'

  return (
    <ColorPicker.Root
      format="hsba"
      onValueChange={handleValueChange}
      positioning={{ placement: 'bottom-end' }}
      size="xs"
      value={pickerColor}
    >
      <ColorPicker.Control>
        <HStack gap="1">
          <ColorPicker.Trigger
            alignItems="center"
            aria-invalid={isInvalid}
            border="0"
            display="flex"
            justifyContent="center"
            p="0"
            unstyled
          >
            <ColorPicker.ValueSwatch />
          </ColorPicker.Trigger>
          <Input
            aria-invalid={isInvalid}
            _invalid={{ borderColor: 'border.error', focusRingColor: 'border.error' }}
            borderColor="transparent"
            fieldSizing="content"
            focusRing="inside"
            focusRingColor="colorPalette.focusRing"
            onChange={(event) => onChange(event.currentTarget.value)}
            size="xs"
            value={value}
            w="auto"
          />
        </HStack>
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
            <Button disabled={!isResetEnabled} onClick={onReset} size="xs" variant="outline">
              <PiArrowCounterClockwise />
              {t.common.actions.reset}
            </Button>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  )
}
