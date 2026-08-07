import { Input } from '@chakra-ui/react'
import { useCallback, type ChangeEvent, type ReactNode } from 'react'

import type { BaseComponentSchema } from '../../../schemas/components'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { useTranslation } from '../../../translations/translation'
import { isDefined } from '../../../utils/isDefined'
import { ColorInput } from '../../common/ColorInput'
import { SectionGroup } from '../../common/SectionGroup'

type NameAndColorSectionProps<T> = {
  baseColor: string
  editable: T
  issues: ValidationIssuesSchema<T>
  onChange: (updated: T) => void
  onResetColor: () => void
}

export function NameAndColorSection<T extends BaseComponentSchema>({
  baseColor,
  editable,
  issues,
  onChange,
  onResetColor,
}: NameAndColorSectionProps<T>): ReactNode {
  const t = useTranslation()
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

  const hasNameError = isDefined(issues.name) && issues.name.severity === 'error'

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>{t.common.labels.general}</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>{t.common.labels.name}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={issues.name}>
        <Input aria-invalid={hasNameError} onChange={handleNameChange} size="xs" value={editable.name} />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>{t.common.labels.color}</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor issue={issues.color}>
        <ColorInput
          isResetEnabled={isDefined(editable.color)}
          issue={issues.color}
          onChange={handleColorChange}
          onReset={onResetColor}
          value={editable.color ?? baseColor}
        />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
