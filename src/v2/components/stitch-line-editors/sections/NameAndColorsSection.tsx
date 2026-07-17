import { Input } from '@chakra-ui/react'
import { useCallback, type ChangeEvent, type ReactNode } from 'react'

import { ColorInput } from '../../common/ColorInput'
import { SectionGroup } from '../../common/SectionGroup'
import type { EditableSchema } from '../../../schemas/editable'
import type { StitchLineSchema } from '../../../schemas/stitching'
import type { ValidationIssuesSchema } from '../../../schemas/validation'
import { isDefined } from '../../../utils/isDefined'

type NameAndColorsSectionProps = {
  editable: EditableSchema<StitchLineSchema>
  issues: ValidationIssuesSchema<StitchLineSchema>
  onChange: (updated: EditableSchema<StitchLineSchema>) => void
}

export const NameAndColorsSection = ({
  editable,
  issues,
  onChange,
}: NameAndColorsSectionProps): ReactNode => {
  const isNameInvalid = isDefined(issues.name) && issues.name.severity === 'error'

  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      onChange({ ...editable, name: event.target.value })
    },
    [editable, onChange],
  )
  const handleStitchHoleColorChange = useCallback(
    (stitchHoleColor: string): void => {
      onChange({ ...editable, stitchHoleColor })
    },
    [editable, onChange],
  )
  const handleStitchThreadColorChange = useCallback(
    (stitchThreadColor: string): void => {
      onChange({ ...editable, stitchThreadColor })
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

      <SectionGroup.SectionRowTitle>Lyuk színe</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <ColorInput issue={issues.stitchHoleColor} onChange={handleStitchHoleColorChange} value={editable.stitchHoleColor} />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>Cérna színe</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <ColorInput
          issue={issues.stitchThreadColor}
          onChange={handleStitchThreadColorChange}
          value={editable.stitchThreadColor}
        />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
