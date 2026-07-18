import { Input } from '@chakra-ui/react'
import { useCallback, type ChangeEvent, type ReactNode } from 'react'

import type { EditableSchema } from '../../../schemas/editable'
import type { StitchLineSchema } from '../../../schemas/stitching'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { isDefined } from '../../../utils/isDefined'
import { ComponentSelect } from '../../common/ComponentSelect'
import { SectionGroup } from '../../common/SectionGroup'

type BasicSettingsSectionProps = {
  editable: EditableSchema<StitchLineSchema>
  issues: ValidationIssuesSchema<StitchLineSchema>
  onChange: (updated: EditableSchema<StitchLineSchema>) => void
}

export const BasicSettingsSection = ({ editable, issues, onChange }: BasicSettingsSectionProps): ReactNode => {
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
      <SectionGroup.SectionHeader>Általános</SectionGroup.SectionHeader>

      <SectionGroup.SectionRowTitle>Név</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <Input aria-invalid={isNameInvalid} onChange={handleNameChange} size="xs" value={editable.name} />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>Komponens</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <ComponentSelect componentId={editable.componentId} onChange={handleComponentChange} />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
