import { useCallback, type FC } from 'react'

import type { EditableSchema } from '../../../schemas/editable'
import type { MagicFixNumericRangeSchema, MagicFixPocketClusterConfigSchema } from '../../../schemas/magicFixConfig'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { SectionGroup } from '../../common/SectionGroup'
import { MagicFixNumericRangeEditor } from '../MagicFixNumericRangeEditor'

export type PocketStepSectionProps = {
  config: MagicFixPocketClusterConfigSchema
  editable: EditableSchema<MagicFixPocketClusterConfigSchema>
  issues: ValidationIssuesSchema<MagicFixPocketClusterConfigSchema>
  onChange: (updated: EditableSchema<MagicFixPocketClusterConfigSchema>) => void
}

export const PocketStepSection: FC<PocketStepSectionProps> = ({ editable, issues, onChange }) => {
  const t = useTranslation()
  const handlePocketStepRangeChange = useCallback(
    (pocketStepRange: EditableSchema<MagicFixNumericRangeSchema>): void => onChange({ ...editable, pocketStepRange }),
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.magicFix.dialog.settings.advanced.sections.pocketStep}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>
        {t.magicFix.dialog.settings.advanced.labels.pocketStep}
      </SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={[issues.pocketStepRange.maxDecrease, issues.pocketStepRange.maxIncrease]}>
        <MagicFixNumericRangeEditor
          issues={issues.pocketStepRange}
          onChange={handlePocketStepRangeChange}
          value={editable.pocketStepRange}
        />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
