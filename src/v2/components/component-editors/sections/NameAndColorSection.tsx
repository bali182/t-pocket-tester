import { Field, Input } from '@chakra-ui/react'
import { useCallback, type ChangeEvent, type ReactNode } from 'react'

import type { BaseComponentSchema } from '../../../schemas/components'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { isDefined } from '../../../utils/isDefined'
import { ColorInput } from '../../common/ColorInput'
import { SectionGroup } from '../../common/SectionGroup'

type NameAndColorSectionProps<T> = {
  editable: T
  issues: ValidationIssuesSchema<T>
  onChange: (updated: T) => void
}

export function NameAndColorSection<T extends BaseComponentSchema>({
  editable,
  issues,
  onChange,
}: NameAndColorSectionProps<T>): ReactNode {
  const t = useTranslation()
  const isNameInvalid = isDefined(issues.name) && issues.name.severity === 'error'
  const isColorInvalid = isDefined(issues.color) && issues.color.severity === 'error'

  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...editable,
        name: event.target.value,
      })
    },
    [editable, onChange],
  )

  const handleColorChange = useCallback(
    (color: string) => {
      onChange({
        ...editable,
        color,
      })
    },
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.common.labels.general()}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>{t.common.labels.name()}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <Field.Root invalid={isNameInvalid}>
          <Input onChange={handleNameChange} size="xs" value={editable.name} />
        </Field.Root>
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.common.labels.color()}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <Field.Root invalid={isColorInvalid} alignItems="stretch">
          <ColorInput issue={issues.color} onChange={handleColorChange} value={editable.color} />
        </Field.Root>
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
