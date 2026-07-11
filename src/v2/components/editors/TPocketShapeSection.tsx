import { useCallback, type FC } from 'react'

import type { PocketClusterSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'
import { NumberInput } from './NumberInput'
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
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="T-fül szélessége">
          <NumberInput
            issue={issues.tPocketTabWidth}
            onChange={handleTPocketTabWidthChange}
            step={1}
            unit="mm"
            value={editable.tPocketTabWidth}
          />
        </EditorFieldRow>

        <EditorFieldRow label="T-zseb szűkülése">
          <NumberInput
            issue={issues.tPocketTaper}
            onChange={handleTPocketTaperChange}
            step={1}
            unit="mm"
            value={editable.tPocketTaper}
          />
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
