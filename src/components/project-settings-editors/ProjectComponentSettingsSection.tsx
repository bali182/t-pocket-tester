import { Field } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type { SubProjectSchema } from '../../schemas/subProject'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { useTranslation } from '../../translations/translation'
import { isDefined } from '../../utils/isDefined'
import { ColorInput } from '../common/ColorInput'
import { SectionGroup } from '../common/SectionGroup'

type ProjectComponentSettingsSectionProps = {
  editable: EditableSchema<SubProjectSchema>
  issues: ValidationIssuesSchema<SubProjectSchema>
  onChange: (updated: EditableSchema<SubProjectSchema>) => void
}

export const ProjectComponentSettingsSection: FC<ProjectComponentSettingsSectionProps> = ({
  editable,
  issues,
  onChange,
}) => {
  const t = useTranslation()
  const isBaseColorInvalid =
    isDefined(issues.componentSettings.baseColor) && issues.componentSettings.baseColor.severity === 'error'
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
      <SectionGroup.SectionRowEditor>
        <Field.Root alignItems="stretch" invalid={isBaseColorInvalid}>
          <ColorInput
            issue={issues.componentSettings.baseColor}
            onChange={handleBaseColorChange}
            value={editable.componentSettings.baseColor}
          />
        </Field.Root>
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
