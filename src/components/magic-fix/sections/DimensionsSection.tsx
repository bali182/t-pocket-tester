import { useCallback, type FC } from 'react'

import type { EditableSchema } from '../../../schemas/editable'
import type { MagicFixHasDimensionsConfigSchema, MagicFixNumericRangeSchema } from '../../../schemas/magicFixConfig'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { SectionGroup } from '../../common/SectionGroup'
import { MagicFixNumericRangeEditor } from '../MagicFixNumericRangeEditor'

export type DimensionsSectionProps<T extends MagicFixHasDimensionsConfigSchema> = {
  config: T
  editable: EditableSchema<T>
  issues: ValidationIssuesSchema<T>
  onChange: (updated: EditableSchema<T>) => void
}

export const DimensionsSection = <T extends MagicFixHasDimensionsConfigSchema>({
  editable,
  issues,
  onChange,
}: DimensionsSectionProps<T>): ReturnType<FC> => {
  const t = useTranslation()
  const handleFixedHeightRangeChange = useCallback(
    (fixedHeightRange: EditableSchema<MagicFixNumericRangeSchema>): void => onChange({ ...editable, fixedHeightRange }),
    [editable, onChange],
  )
  const handleFixedWidthRangeChange = useCallback(
    (fixedWidthRange: EditableSchema<MagicFixNumericRangeSchema>): void => onChange({ ...editable, fixedWidthRange }),
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.magicFix.dialog.settings.advanced.sections.dimensions}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>{t.common.labels.height}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={[issues.fixedHeightRange.maxDecrease, issues.fixedHeightRange.maxIncrease]}>
        <MagicFixNumericRangeEditor
          issues={issues.fixedHeightRange}
          onChange={handleFixedHeightRangeChange}
          value={editable.fixedHeightRange}
        />
      </SectionGroup.SectionRowEditor>
      <SectionGroup.SectionRowTitle>{t.common.labels.width}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={[issues.fixedWidthRange.maxDecrease, issues.fixedWidthRange.maxIncrease]}>
        <MagicFixNumericRangeEditor
          issues={issues.fixedWidthRange}
          onChange={handleFixedWidthRangeChange}
          value={editable.fixedWidthRange}
        />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
