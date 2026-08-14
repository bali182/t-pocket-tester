import { useCallback, type FC } from 'react'

import type { EditableSchema } from '../../../schemas/editable'
import type { MagicFixHasGapConfigSchema, MagicFixNumericRangeSchema } from '../../../schemas/magicFixConfig'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { SectionGroup } from '../../common/SectionGroup'
import { MagicFixNumericRangeEditor } from '../MagicFixNumericRangeEditor'

export type LayoutGapSectionProps<T extends MagicFixHasGapConfigSchema> = {
  config: T
  editable: EditableSchema<T>
  issues: ValidationIssuesSchema<T>
  onChange: (updated: EditableSchema<T>) => void
}

export const LayoutGapSection = <T extends MagicFixHasGapConfigSchema>({
  editable,
  issues,
  onChange,
}: LayoutGapSectionProps<T>): ReturnType<FC> => {
  const t = useTranslation()
  const handleLayoutGapRangeChange = useCallback(
    (layoutGapRange: EditableSchema<MagicFixNumericRangeSchema>): void => onChange({ ...editable, layoutGapRange }),
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.magicFix.dialog.settings.advanced.sections.layoutGap}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>
        {t.magicFix.dialog.settings.advanced.labels.layoutGap}
      </SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={[issues.layoutGapRange.maxDecrease, issues.layoutGapRange.maxIncrease]}>
        <MagicFixNumericRangeEditor
          issues={issues.layoutGapRange}
          onChange={handleLayoutGapRangeChange}
          value={editable.layoutGapRange}
        />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
