import { SegmentGroup } from '@chakra-ui/react'
import { useCallback, type ReactNode } from 'react'
import {
  PiAlignBottomSimple,
  PiAlignCenterHorizontalSimple,
  PiAlignCenterVerticalSimple,
  PiAlignLeftSimple,
  PiAlignRightSimple,
  PiAlignTopSimple,
} from 'react-icons/pi'

import type { AnchorSchema, HasXYOffsetSchema } from '../../../schemas/common'
import type { EditableSchema } from '../../../schemas/editable'
import type { HasAnchorsSchema } from '../../../schemas/hole'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { NumberInput } from '../../common/NumberInput'
import { SectionGroup } from '../../common/SectionGroup'

type HolePositionSectionProps<T> = {
  editable: EditableSchema<T>
  issues: ValidationIssuesSchema<T>
  onChange: (updated: EditableSchema<T>) => void
}

export function HolePositionSection<T extends HasAnchorsSchema & HasXYOffsetSchema>({
  editable,
  issues,
  onChange,
}: HolePositionSectionProps<T>): ReactNode {
  const t = useTranslation()
  const handleXAnchorChange = useCallback(
    (details: SegmentGroup.ValueChangeDetails): void => {
      onChange({ ...editable, xAnchor: details.value as AnchorSchema })
    },
    [editable, onChange],
  )
  const handleYAnchorChange = useCallback(
    (details: SegmentGroup.ValueChangeDetails): void => {
      onChange({ ...editable, yAnchor: details.value as AnchorSchema })
    },
    [editable, onChange],
  )
  const handleXOffsetChange = useCallback(
    (xOffset: string): void => {
      onChange({ ...editable, xOffset })
    },
    [editable, onChange],
  )
  const handleYOffsetChange = useCallback(
    (yOffset: string): void => {
      onChange({ ...editable, yOffset })
    },
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.hole.editor.position.title}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>{t.hole.editor.position.xAnchor}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={issues.xAnchor}>
        <SegmentGroup.Root onValueChange={handleXAnchorChange} size="sm" value={editable.xAnchor}>
          <SegmentGroup.Indicator />
          <SegmentGroup.Item value="start">
            <SegmentGroup.ItemHiddenInput />
            <PiAlignLeftSimple /> {t.common.anchors.left}
          </SegmentGroup.Item>
          <SegmentGroup.Item value="middle">
            <SegmentGroup.ItemHiddenInput />
            <PiAlignCenterHorizontalSimple /> {t.common.anchors.center}
          </SegmentGroup.Item>
          <SegmentGroup.Item value="end">
            <SegmentGroup.ItemHiddenInput />
            <PiAlignRightSimple /> {t.common.anchors.right}
          </SegmentGroup.Item>
        </SegmentGroup.Root>
      </SectionGroup.SectionRowEditor>
      <SectionGroup.SectionRowTitle>{t.hole.editor.position.xOffset}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={issues.xOffset}>
        <NumberInput issue={issues.xOffset} onChange={handleXOffsetChange} unit="mm" value={editable.xOffset} />
      </SectionGroup.SectionRowEditor>
      <SectionGroup.SectionRowTitle>{t.hole.editor.position.yAnchor}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={issues.yAnchor}>
        <SegmentGroup.Root onValueChange={handleYAnchorChange} size="sm" value={editable.yAnchor}>
          <SegmentGroup.Indicator />
          <SegmentGroup.Item value="start">
            <SegmentGroup.ItemHiddenInput />
            <PiAlignTopSimple /> {t.common.anchors.top}
          </SegmentGroup.Item>
          <SegmentGroup.Item value="middle">
            <SegmentGroup.ItemHiddenInput />
            <PiAlignCenterVerticalSimple /> {t.common.anchors.center}
          </SegmentGroup.Item>
          <SegmentGroup.Item value="end">
            <SegmentGroup.ItemHiddenInput />
            <PiAlignBottomSimple /> {t.common.anchors.bottom}
          </SegmentGroup.Item>
        </SegmentGroup.Root>
      </SectionGroup.SectionRowEditor>
      <SectionGroup.SectionRowTitle>{t.hole.editor.position.yOffset}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={issues.yOffset}>
        <NumberInput issue={issues.yOffset} onChange={handleYOffsetChange} unit="mm" value={editable.yOffset} />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
