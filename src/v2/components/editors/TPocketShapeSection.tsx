import { useCallback, type FC } from 'react'

import type { PocketClusterSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { NumberInput } from './NumberInput'
import { SectionGroup } from './SectionGroup'
type TPocketShapeSectionProps = {
  component: PocketClusterSchema
  editable: EditableSchema<PocketClusterSchema>
  issues: ValidationIssuesSchema<PocketClusterSchema>
  onChange: (updated: EditableSchema<PocketClusterSchema>) => void
}

export const TPocketShapeSection: FC<TPocketShapeSectionProps> = ({ editable, issues, onChange }) => {
  const handleTPocketTabWidthChange = useCallback(
    (tPocketTabWidth: string) => {
      onChange({
        ...editable,
        tPocketTabWidth,
      })
    },
    [editable, onChange],
  )

  const handleTPocketTaperChange = useCallback(
    (tPocketTaper: string) => {
      onChange({
        ...editable,
        tPocketTaper,
      })
    },
    [editable, onChange],
  )

  return (
    <SectionGroup.Section>
      <SectionGroup.SectionHeader>T-zsebek</SectionGroup.SectionHeader>
      <SectionGroup.SectionRowTitle>Fül szélesség</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput
          issue={issues.tPocketTabWidth}
          onChange={handleTPocketTabWidthChange}
          step={1}
          unit="mm"
          value={editable.tPocketTabWidth}
        />
      </SectionGroup.SectionRowEditor>

      <SectionGroup.SectionRowTitle>Szűkülés</SectionGroup.SectionRowTitle>
      <SectionGroup.SectionRowEditor>
        <NumberInput
          issue={issues.tPocketTaper}
          onChange={handleTPocketTaperChange}
          step={1}
          unit="mm"
          value={editable.tPocketTaper}
        />
      </SectionGroup.SectionRowEditor>
    </SectionGroup.Section>
  )
}
