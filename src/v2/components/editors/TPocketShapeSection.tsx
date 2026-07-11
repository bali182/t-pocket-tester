import { Input } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'

import type { PocketClusterSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { isDefined } from '../../utils/isDefined'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'
type TPocketShapeSectionProps = {
  component: EditableSchema<PocketClusterSchema>
  issues: ValidationIssuesSchema<PocketClusterSchema>
  onChange: (updated: EditableSchema<PocketClusterSchema>) => void
}

export const TPocketShapeSection: FC<TPocketShapeSectionProps> = ({ component, issues, onChange }) => {
  const handleTPocketTabWidthChange = useCallback(
    (tPocketTabWidth: string) => {
      onChange({
        ...component,
        tPocketTabWidth,
      })
    },
    [component, onChange],
  )

  const handleTPocketTaperChange = useCallback(
    (tPocketTaper: string) => {
      onChange({
        ...component,
        tPocketTaper,
      })
    },
    [component, onChange],
  )

  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="T-fül szélessége">
          <Input
            inputMode="decimal"
            aria-invalid={isDefined(issues.tPocketTabWidth) && issues.tPocketTabWidth.severity === 'error'}
            onChange={(event) => handleTPocketTabWidthChange(event.currentTarget.value)}
            type="text"
            value={component.tPocketTabWidth}
          />
        </EditorFieldRow>

        <EditorFieldRow label="T-zseb szűkülése">
          <Input
            inputMode="decimal"
            aria-invalid={isDefined(issues.tPocketTaper) && issues.tPocketTaper.severity === 'error'}
            onChange={(event) => handleTPocketTaperChange(event.currentTarget.value)}
            type="text"
            value={component.tPocketTaper}
          />
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
