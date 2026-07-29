import { Input } from '@chakra-ui/react'
import { useCallback, type ChangeEvent, type ReactNode } from 'react'

import { HasIdentitySchema } from '../../../schemas/common'
import type { ComponentSchema } from '../../../schemas/components'
import type { EditableSchema } from '../../../schemas/editable'
import type { HasTargetSchema } from '../../../schemas/stitching'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { isDefined } from '../../../utils/isDefined'
import { ComponentSelect } from '../../common/ComponentSelect'
import { SectionGroup } from '../../common/SectionGroup'

export type BaseStitchLineSchema = HasIdentitySchema & HasTargetSchema

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
      onChange({ ...editable, targetId: componentId })
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
        <ComponentSelect
          componentId={editable.targetId}
          componentTypes={componentTypes}
          onChange={handleComponentChange}
        />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
