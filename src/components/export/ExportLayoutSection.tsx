import { useCallback, type ReactNode } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type { BaseExportSettingsSchema } from '../../schemas/settings'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { useTranslation } from '../../translations/translation'
import { NumberInput } from '../common/NumberInput'
import { SectionGroup } from '../common/SectionGroup'

type ExportLayoutSectionProps<T extends BaseExportSettingsSchema> = {
  editable: EditableSchema<T>
  issues: ValidationIssuesSchema<BaseExportSettingsSchema>
  onChange: (updated: EditableSchema<T>) => void
}

export function ExportLayoutSection<T extends BaseExportSettingsSchema>({
  editable,
  issues,
  onChange,
}: ExportLayoutSectionProps<T>): ReactNode {
  const t = useTranslation()
  const handleGapChange = useCallback(
    (gap: string): void => {
      onChange({ ...editable, gap })
    },
    [editable, onChange],
  )
  const handlePaddingChange = useCallback(
    (padding: string): void => {
      onChange({ ...editable, padding })
    },
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.exportSettings.sections.layout}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>{t.exportSettings.labels.gap}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={issues.gap}>
        <NumberInput issue={issues.gap} onChange={handleGapChange} step={1} unit="mm" value={editable.gap} />
      </SectionGroup.SectionRowEditor>
      <SectionGroup.SectionRowTitle>{t.exportSettings.labels.padding}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={issues.padding}>
        <NumberInput
          issue={issues.padding}
          onChange={handlePaddingChange}
          step={1}
          unit="mm"
          value={editable.padding}
        />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
