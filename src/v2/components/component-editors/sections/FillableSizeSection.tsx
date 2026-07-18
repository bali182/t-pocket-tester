import { Box, HStack, Switch } from '@chakra-ui/react'
import { useCallback } from 'react'
import { PiArrowsHorizontal, PiArrowsVertical, PiRuler } from 'react-icons/pi'

import type { HasFillableSizeSchema } from '../../../schemas/components'
import type { EditableSchema } from '../../../schemas/editable'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { NumberInput } from '../../common/NumberInput'
import { SectionGroup } from '../../common/SectionGroup'

type FillableSizeSectionProps<T extends HasFillableSizeSchema> = {
  component: T
  editable: EditableSchema<T>
  issues: ValidationIssuesSchema<HasFillableSizeSchema>
  onChange: (updated: EditableSchema<T>) => void
}

export function FillableSizeSection<T extends HasFillableSizeSchema>({
  editable,
  issues,
  onChange,
}: FillableSizeSectionProps<T>) {
  const handleAutoWidthChange = useCallback(
    (details: Switch.CheckedChangeDetails) => {
      onChange({
        ...editable,
        autoWidth: !details.checked,
      })
    },
    [editable, onChange],
  )

  const handleAutoHeightChange = useCallback(
    (details: Switch.CheckedChangeDetails) => {
      onChange({
        ...editable,
        autoHeight: !details.checked,
      })
    },
    [editable, onChange],
  )

  const handleWidthChange = useCallback(
    (width: string) => {
      onChange({
        ...editable,
        width,
      })
    },
    [editable, onChange],
  )

  const handleHeightChange = useCallback(
    (height: string) => {
      onChange({
        ...editable,
        height,
      })
    },
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>Méret</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>Szélesség</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
          <HStack gap="2">
            <Switch.Root checked={!editable.autoWidth} onCheckedChange={handleAutoWidthChange} size="md">
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb>
                  <Switch.ThumbIndicator fallback={<PiArrowsHorizontal />}>
                    <PiRuler />
                  </Switch.ThumbIndicator>
                </Switch.Thumb>
              </Switch.Control>
            </Switch.Root>
            <Box flex="1" minWidth="0">
              <NumberInput
                disabled={editable.autoWidth}
                issue={issues.width}
                onChange={handleWidthChange}
                step={1}
                unit="mm"
                value={editable.width}
              />
            </Box>
          </HStack>
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>Magasság</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
          <HStack gap="2">
            <Switch.Root checked={!editable.autoHeight} onCheckedChange={handleAutoHeightChange} size="md">
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb>
                  <Switch.ThumbIndicator fallback={<PiArrowsVertical />}>
                    <PiRuler />
                  </Switch.ThumbIndicator>
                </Switch.Thumb>
              </Switch.Control>
            </Switch.Root>
            <Box flex="1" minWidth="0">
              <NumberInput
                disabled={editable.autoHeight}
                issue={issues.height}
                onChange={handleHeightChange}
                step={1}
                unit="mm"
                value={editable.height}
              />
            </Box>
          </HStack>
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
