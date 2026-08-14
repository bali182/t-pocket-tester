import { useCallback, type FC } from 'react'

import type { EditableSchema } from '../../../schemas/editable'
import type { MagicFixHasPreferredMinimumDistanceFromEdgeConfigSchema } from '../../../schemas/magicFixConfig'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { NumberInput } from '../../common/NumberInput'
import { SectionGroup } from '../../common/SectionGroup'

export type PreferredMinimumDistanceSectionProps<T extends MagicFixHasPreferredMinimumDistanceFromEdgeConfigSchema> = {
  config: T
  editable: EditableSchema<T>
  issues: ValidationIssuesSchema<T>
  onChange: (updated: EditableSchema<T>) => void
}

export const PreferredMinimumDistanceSection = <T extends MagicFixHasPreferredMinimumDistanceFromEdgeConfigSchema>({
  editable,
  issues,
  onChange,
}: PreferredMinimumDistanceSectionProps<T>): ReturnType<FC> => {
  const t = useTranslation()
  const handlePreferredMinimumDistanceFromEdgeChange = useCallback(
    (preferredMinimumDistanceFromEdge: string): void => onChange({ ...editable, preferredMinimumDistanceFromEdge }),
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.magicFix.dialog.settings.advanced.sections.distance}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>
        {t.magicFix.dialog.settings.advanced.labels.preferredMinimumDistanceFromEdge}
      </SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={issues.preferredMinimumDistanceFromEdge}>
        <NumberInput
          issue={issues.preferredMinimumDistanceFromEdge}
          onChange={handlePreferredMinimumDistanceFromEdgeChange}
          unit="mm"
          value={editable.preferredMinimumDistanceFromEdge}
        />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
