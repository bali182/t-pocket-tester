import { Input } from '@chakra-ui/react'
import { useCallback, type ChangeEvent, type ReactNode } from 'react'

import type { HasComponentReferenceSchema, HasIdentitySchema } from '../../../schemas/common'
import type { EditableSchema } from '../../../schemas/editable'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { isDefined } from '../../../utils/isDefined'
import { ComponentSelect } from '../../common/ComponentSelect'
import { SectionGroup } from '../../common/SectionGroup'

type HoleBasicSettingsSectionProps<T extends HasIdentitySchema & HasComponentReferenceSchema> = {
  editable: EditableSchema<T>
  issues: ValidationIssuesSchema<HasIdentitySchema>
  onChange: (updated: EditableSchema<T>) => void
}

export function HoleBasicSettingsSection<T extends HasIdentitySchema & HasComponentReferenceSchema>({
  editable,
  issues,
  onChange,
}: HoleBasicSettingsSectionProps<T>): ReactNode {
  const t = useTranslation()
  const isNameInvalid = isDefined(issues.name) && issues.name.severity === 'error'
  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      onChange({ ...editable, name: event.target.value })
    },
    [editable, onChange],
  )
  const handleComponentChange = useCallback(
    (componentId: string): void => {
      onChange({ ...editable, componentId })
    },
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.common.labels.general}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>{t.common.labels.name}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <Input aria-invalid={isNameInvalid} onChange={handleNameChange} size="xs" value={editable.name} />
      </SectionGroup.SectionRowEditor>
      <SectionGroup.SectionRowTitle>{t.common.labels.component}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <ComponentSelect componentId={editable.componentId} onChange={handleComponentChange} />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
