import { Field, Input } from '@chakra-ui/react'
import { useCallback, type ChangeEvent, type FC } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type { SubProjectSchema } from '../../schemas/subProject'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { useTranslation } from '../../translations/translation'
import { isDefined } from '../../utils/isDefined'
import { SectionGroup } from '../common/SectionGroup'

type ProjectBasicSectionProps = {
  editable: EditableSchema<SubProjectSchema>
  issues: ValidationIssuesSchema<SubProjectSchema>
  onChange: (updated: EditableSchema<SubProjectSchema>) => void
}

export const ProjectBasicSection: FC<ProjectBasicSectionProps> = ({ editable, issues, onChange }) => {
  const t = useTranslation()
  const isNameInvalid = isDefined(issues.name) && issues.name.severity === 'error'
  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      onChange({ ...editable, name: event.target.value })
    },
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.common.labels.general}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>{t.common.labels.name}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <Field.Root invalid={isNameInvalid}>
          <Input autoFocus onChange={handleNameChange} size="xs" value={editable.name} />
        </Field.Root>
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
