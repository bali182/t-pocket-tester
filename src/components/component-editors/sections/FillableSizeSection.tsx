import { useCallback } from 'react'
import { PiArrowsHorizontal, PiArrowsVertical, PiRuler } from 'react-icons/pi'

import type { HasAutoDimensionsSchema } from '../../../schemas/components'
import type { EditableSchema } from '../../../schemas/editable'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { AutoDimensionEditor } from '../../common/AutoDimensionEditor'
import { SectionGroup } from '../../common/SectionGroup'

type FillableSizeSectionProps<T> = {
  component: T
  editable: EditableSchema<T>
  issues: ValidationIssuesSchema<T>
  onChange: (updated: EditableSchema<T>) => void
}

export function FillableSizeSection<T extends HasAutoDimensionsSchema>({
  editable,
  issues,
  onChange,
}: FillableSizeSectionProps<T>) {
  const t = useTranslation()
  const handleAutoWidthChange = useCallback(
    (autoWidth: boolean) => {
      onChange({
        ...editable,
        autoWidth,
      })
    },
    [editable, onChange],
  )

  const handleAutoHeightChange = useCallback(
    (autoHeight: boolean) => {
      onChange({
        ...editable,
        autoHeight,
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
      <SectionGroup.SectionHeader>{t.common.labels.size}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>{t.common.labels.width}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={issues.width}>
        <AutoDimensionEditor
          ariaLabel={t.common.labels.width}
          auto={editable.autoWidth}
          autoIcon={PiArrowsHorizontal}
          placeholder={t.common.placeholders.fill}
          issue={issues.width}
          manualIcon={PiRuler}
          onAutoChange={handleAutoWidthChange}
          onValueChange={handleWidthChange}
          step={1}
          unit="mm"
          value={editable.width}
        />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.common.labels.height}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={issues.height}>
        <AutoDimensionEditor
          ariaLabel={t.common.labels.height}
          auto={editable.autoHeight}
          autoIcon={PiArrowsVertical}
          placeholder={t.common.placeholders.fill}
          issue={issues.height}
          manualIcon={PiRuler}
          onAutoChange={handleAutoHeightChange}
          onValueChange={handleHeightChange}
          step={1}
          unit="mm"
          value={editable.height}
        />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
