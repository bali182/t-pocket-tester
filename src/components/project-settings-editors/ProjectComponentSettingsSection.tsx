import { useCallback, type FC } from 'react'

import { leatherColors } from '../../data/colors'
import { useColors } from '../../hooks/useColors'
import type { EditableSchema } from '../../schemas/editable'
import type { ProjectSchema } from '../../schemas/project'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { useTranslation } from '../../translations/translation'
import { ColorInput } from '../common/ColorInput'
import { SectionGroup } from '../common/SectionGroup'

type ProjectComponentSettingsSectionProps = {
  editable: EditableSchema<ProjectSchema>
  issues: ValidationIssuesSchema<ProjectSchema>
  onChange: (updated: EditableSchema<ProjectSchema>) => void
}

export const ProjectComponentSettingsSection: FC<ProjectComponentSettingsSectionProps> = ({
  editable,
  issues,
  onChange,
}) => {
  const t = useTranslation()
  const popoverLeatherColors = useColors(leatherColors)
  const handleBaseColorChange = useCallback(
    (baseColor: string): void => {
      onChange({
        ...editable,
        componentSettings: {
          ...editable.componentSettings,
          baseColor,
        },
      })
    },
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.projects.settingsDialog.components.title}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>{t.projects.settingsDialog.components.baseColor}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={issues.componentSettings.baseColor}>
        <ColorInput
          colors={popoverLeatherColors}
          issue={issues.componentSettings.baseColor}
          onChange={handleBaseColorChange}
          value={editable.componentSettings.baseColor}
        />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
