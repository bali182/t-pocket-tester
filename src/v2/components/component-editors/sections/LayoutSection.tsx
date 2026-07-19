import { SegmentGroup } from '@chakra-ui/react'
import { useCallback, type ReactNode } from 'react'
import { PiArrowDown, PiArrowLeft, PiArrowRight, PiArrowUp, PiColumns, PiRows } from 'react-icons/pi'

import type { HasLayoutSchema } from '../../../schemas/components'
import type { EditableSchema } from '../../../schemas/editable'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { NumberInput } from '../../common/NumberInput'
import { SectionGroup } from '../../common/SectionGroup'

type LayoutSectionProps<T extends HasLayoutSchema> = {
  component: T
  editable: EditableSchema<T>
  issues: ValidationIssuesSchema<T>
  onChange: (updated: EditableSchema<T>) => void
}

export function LayoutSection<T extends HasLayoutSchema>({
  editable,
  issues,
  onChange,
}: LayoutSectionProps<T>): ReactNode {
  const t = useTranslation()
  const handleOrientationChange = useCallback(
    (details: SegmentGroup.ValueChangeDetails) => {
      onChange({ ...editable, layoutOrientation: details.value })
    },
    [editable, onChange],
  )

  const handleOrderChange = useCallback(
    (details: SegmentGroup.ValueChangeDetails) => {
      onChange({ ...editable, layoutOrder: details.value })
    },
    [editable, onChange],
  )

  const handleGapChange = useCallback(
    (layoutGap: string) => {
      onChange({ ...editable, layoutGap })
    },
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.component.editor.layout.title()}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>{t.component.editor.layout.orientation()}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <SegmentGroup.Root onValueChange={handleOrientationChange} size="sm" value={editable.layoutOrientation}>
          <SegmentGroup.Indicator />
          <SegmentGroup.Item aria-label={t.component.editor.layout.horizontal()} value="horizontal">
            <SegmentGroup.ItemHiddenInput />
            <PiColumns />
          </SegmentGroup.Item>
          <SegmentGroup.Item aria-label={t.component.editor.layout.vertical()} value="vertical">
            <SegmentGroup.ItemHiddenInput />
            <PiRows />
          </SegmentGroup.Item>
        </SegmentGroup.Root>
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.component.editor.layout.order()}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <SegmentGroup.Root onValueChange={handleOrderChange} size="sm" value={editable.layoutOrder}>
          <SegmentGroup.Indicator />
          <SegmentGroup.Item aria-label={t.component.editor.layout.defaultOrder()} value="default">
            <SegmentGroup.ItemHiddenInput />
            {editable.layoutOrientation === 'horizontal' ? <PiArrowRight /> : <PiArrowDown />}
          </SegmentGroup.Item>
          <SegmentGroup.Item aria-label={t.component.editor.layout.reverseOrder()} value="reverse">
            <SegmentGroup.ItemHiddenInput />
            {editable.layoutOrientation === 'horizontal' ? <PiArrowLeft /> : <PiArrowUp />}
          </SegmentGroup.Item>
        </SegmentGroup.Root>
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.component.editor.layout.gap()}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput
          issue={issues.layoutGap}
          onChange={handleGapChange}
          step={1}
          unit="mm"
          value={editable.layoutGap}
        />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
