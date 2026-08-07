import { Input } from '@chakra-ui/react'
import { useCallback, type ChangeEvent, type FC } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type { ProjectSchema } from '../../schemas/project'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { useTranslation } from '../../translations/translation'
import { isDefined } from '../../utils/isDefined'
import { SectionGroup } from '../common/SectionGroup'

type ProjectBasicSectionProps = {
  editable: EditableSchema<ProjectSchema>
  issues: ValidationIssuesSchema<ProjectSchema>
  onChange: (updated: EditableSchema<ProjectSchema>) => void
}

export const ProjectBasicSection: FC<ProjectBasicSectionProps> = ({ editable, issues, onChange }) => {
  const t = useTranslation()
  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      onChange({ ...editable, name: event.target.value })
    },
    [editable, onChange],
  )

  const hasNameError = isDefined(issues.name)

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.common.labels.general}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>{t.common.labels.name}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={issues.name}>
        <Input aria-invalid={hasNameError} autoFocus onChange={handleNameChange} size="xs" value={editable.name} />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
