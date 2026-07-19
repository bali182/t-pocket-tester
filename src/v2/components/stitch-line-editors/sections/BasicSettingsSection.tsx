import { Input } from '@chakra-ui/react'
import { useCallback, type ChangeEvent, type ReactNode } from 'react'

import type { EditableSchema } from '../../../schemas/editable'
import type { BaseStitchLineSchema } from '../../../schemas/stitching'
import type { ComponentSchema } from '../../../schemas/components'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { isDefined } from '../../../utils/isDefined'
import { ComponentSelect } from '../../common/ComponentSelect'
import { SectionGroup } from '../../common/SectionGroup'

type BasicSettingsSectionProps<T extends BaseStitchLineSchema> = {
  editable: EditableSchema<T>
  componentTypes?: ComponentSchema['type'][]
  issues: ValidationIssuesSchema<T>
  onChange: (updated: EditableSchema<T>) => void
}

export const BasicSettingsSection = <T extends BaseStitchLineSchema>({
  editable,
  componentTypes,
  issues,
  onChange,
}: BasicSettingsSectionProps<T>): ReactNode => {
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
        <ComponentSelect componentId={editable.componentId} componentTypes={componentTypes} onChange={handleComponentChange} />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
