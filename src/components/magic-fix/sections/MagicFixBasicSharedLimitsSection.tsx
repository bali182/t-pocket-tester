import { useCallback, type FC } from 'react'

import type { EditableSchema } from '../../../schemas/editable'
import type { MagicFixBasicUIConfigSchema, MagicFixNumericRangeSchema } from '../../../schemas/magicFixConfig'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { NumberInput } from '../../common/NumberInput'
import { SectionGroup } from '../../common/SectionGroup'
import { MagicFixNumericRangeEditor } from '../MagicFixNumericRangeEditor'

export type MagicFixBasicSharedLimitsSectionProps = {
  config: MagicFixBasicUIConfigSchema
  editable: EditableSchema<MagicFixBasicUIConfigSchema>
  issues: ValidationIssuesSchema<MagicFixBasicUIConfigSchema>
  onChange: (updated: EditableSchema<MagicFixBasicUIConfigSchema>) => void
}

export const MagicFixBasicSharedLimitsSection: FC<MagicFixBasicSharedLimitsSectionProps> = ({
  editable,
  issues,
  onChange,
}) => {
  const t = useTranslation()

  const handlePreferredMinimumDistanceFromEdgeChange = useCallback(
    (preferredMinimumDistanceFromEdge: string): void => onChange({ ...editable, preferredMinimumDistanceFromEdge }),
    [editable, onChange],
  )

  const handleModifyRangeChange = useCallback(
    (modifyRange: EditableSchema<Partial<MagicFixNumericRangeSchema>>): void => onChange({ ...editable, modifyRange }),
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.magicFix.dialog.settings.basic.sections.sharedLimits}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>
        {t.magicFix.dialog.settings.basic.labels.preferredMinimumDistanceFromEdge}
      </SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={issues.preferredMinimumDistanceFromEdge}>
        <NumberInput
          issue={issues.preferredMinimumDistanceFromEdge}
          onChange={handlePreferredMinimumDistanceFromEdgeChange}
          unit="mm"
          value={editable.preferredMinimumDistanceFromEdge}
        />
      </SectionGroup.SectionRowEditor>
      <SectionGroup.SectionRowTitle>{t.magicFix.dialog.settings.basic.labels.modifyRange}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={[issues.modifyRange.maxDecrease, issues.modifyRange.maxIncrease]}>
        <MagicFixNumericRangeEditor
          issues={issues.modifyRange as ValidationIssuesSchema<MagicFixNumericRangeSchema>}
          onChange={handleModifyRangeChange}
          value={editable.modifyRange as EditableSchema<MagicFixNumericRangeSchema>}
        />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
