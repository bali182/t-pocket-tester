import { SegmentGroup, SegmentGroupValueChangeDetails } from '@chakra-ui/react'
import { useCallback, type ReactNode } from 'react'
import {
  PiAlignBottomSimple,
  PiAlignCenterHorizontalSimple,
  PiAlignCenterVerticalSimple,
  PiAlignLeftSimple,
  PiAlignRightSimple,
  PiAlignTopSimple,
  PiArrowsHorizontal,
  PiArrowsVertical,
  PiColumns,
  PiRows,
  PiRuler,
} from 'react-icons/pi'

import { AnchorSchema } from '../../../schemas/common'
import type { HasLayoutSchema } from '../../../schemas/components'
import type { EditableSchema } from '../../../schemas/editable'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { AutoDimensionEditor } from '../../common/AutoDimensionEditor'
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

  const handleGapChange = useCallback(
    (layoutGap: string) => {
      onChange({ ...editable, layoutGap })
    },
    [editable, onChange],
  )

  const handleAutoLayoutGapChange = useCallback(
    (autoLayoutGap: boolean) => {
      onChange({ ...editable, autoLayoutGap })
    },
    [editable, onChange],
  )

  const handleOffAxisAnchorChange = useCallback(
    (details: SegmentGroupValueChangeDetails) => {
      onChange({ ...editable, offAxisAnchor: details.value as AnchorSchema })
    },
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.component.editor.layout.title}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>{t.component.editor.layout.orientation}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={issues.layoutOrientation}>
        <SegmentGroup.Root onValueChange={handleOrientationChange} size="sm" value={editable.layoutOrientation}>
          <SegmentGroup.Indicator />
          <SegmentGroup.Item aria-label={t.component.editor.layout.horizontal} value="horizontal">
            <SegmentGroup.ItemHiddenInput />
            <PiColumns /> {t.component.editor.layout.horizontal}
          </SegmentGroup.Item>
          <SegmentGroup.Item aria-label={t.component.editor.layout.vertical} value="vertical">
            <SegmentGroup.ItemHiddenInput />
            <PiRows /> {t.component.editor.layout.vertical}
          </SegmentGroup.Item>
        </SegmentGroup.Root>
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.component.editor.layout.anchor}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={issues.offAxisAnchor}>
        <SegmentGroup.Root onValueChange={handleOffAxisAnchorChange} size="sm" value={editable.offAxisAnchor}>
          <SegmentGroup.Indicator />
          <SegmentGroup.Item value="start">
            <SegmentGroup.ItemHiddenInput />
            {editable.layoutOrientation === 'horizontal' ? <PiAlignTopSimple /> : <PiAlignLeftSimple />}
            {editable.layoutOrientation === 'horizontal' ? t.common.anchors.top : t.common.anchors.left}
          </SegmentGroup.Item>
          <SegmentGroup.Item value="middle">
            <SegmentGroup.ItemHiddenInput />
            {editable.layoutOrientation === 'horizontal' ? (
              <PiAlignCenterVerticalSimple />
            ) : (
              <PiAlignCenterHorizontalSimple />
            )}
            {t.common.anchors.center}
          </SegmentGroup.Item>
          <SegmentGroup.Item value="end">
            <SegmentGroup.ItemHiddenInput />
            {editable.layoutOrientation === 'horizontal' ? <PiAlignBottomSimple /> : <PiAlignRightSimple />}
            {editable.layoutOrientation === 'horizontal' ? t.common.anchors.bottom : t.common.anchors.right}
          </SegmentGroup.Item>
        </SegmentGroup.Root>
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.component.editor.layout.gap}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={issues.layoutGap}>
        <AutoDimensionEditor
          ariaLabel={t.component.editor.layout.gap}
          auto={editable.autoLayoutGap}
          autoIcon={editable.layoutOrientation === 'horizontal' ? PiArrowsHorizontal : PiArrowsVertical}
          placeholder={t.common.placeholders.fill}
          issue={issues.layoutGap}
          manualIcon={PiRuler}
          onAutoChange={handleAutoLayoutGapChange}
          onValueChange={handleGapChange}
          unit="mm"
          value={editable.layoutGap}
        />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
