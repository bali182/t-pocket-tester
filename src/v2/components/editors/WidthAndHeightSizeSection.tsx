import { useCallback, type FC } from 'react'

import type { RootPanelSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'
import { NumberInput } from './NumberInput'

type WidthAndHeightSizeSectionProps = {
  component: RootPanelSchema
  editable: EditableSchema<RootPanelSchema>
  issues: ValidationIssuesSchema<RootPanelSchema>
  onChange: (updated: EditableSchema<RootPanelSchema>) => void
}

export const WidthAndHeightSizeSection: FC<WidthAndHeightSizeSectionProps> = ({ editable, issues, onChange }) => {
  const handleWidthChange = useCallback(
    (width: string) => {
      onChange({
        ...editable,
        width,
      })
    },
    [editable, onChange],
  )

  const handleHeightChange = useCallback(
    (height: string) => {
      onChange({
        ...editable,
        height,
      })
    },
    [editable, onChange],
  )

  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="Szélesség">
          <NumberInput issue={issues.width} onChange={handleWidthChange} step={1} unit="mm" value={editable.width} />
        </EditorFieldRow>

        <EditorFieldRow label="Magasság">
          <NumberInput issue={issues.height} onChange={handleHeightChange} step={1} unit="mm" value={editable.height} />
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
