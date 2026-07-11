import { useCallback } from 'react'

import type { HasFillableSizeSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { FillableSizeSchema } from '../../schemas/geometry'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'
import { FillableSizeInput } from './FillableSizeInput'

type FillableSizeSectionProps<T extends HasFillableSizeSchema> = {
  component: T
  editable: EditableSchema<T>
  issues: ValidationIssuesSchema<FillableSizeSchema>
  onChange: (updated: EditableSchema<T>) => void
}

export function FillableSizeSection<T extends HasFillableSizeSchema>({
  component,
  editable,
  issues,
  onChange,
}: FillableSizeSectionProps<T>) {
  const handleWidthChange = useCallback(
    (width: string) => {
      onChange({
        ...editable,
        size: {
          ...editable.size,
          width,
        },
      })
    },
    [editable, onChange],
  )

  const handleHeightChange = useCallback(
    (height: string) => {
      onChange({
        ...editable,
        size: {
          ...editable.size,
          height,
        },
      })
    },
    [editable, onChange],
  )

  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="Szélesség">
          <FillableSizeInput
            issue={issues.width}
            lastValidValue={typeof component.size.width === 'number' ? component.size.width : undefined}
            onChange={handleWidthChange}
            value={editable.size.width}
          />
        </EditorFieldRow>

        <EditorFieldRow label="Magasság">
          <FillableSizeInput
            issue={issues.height}
            lastValidValue={typeof component.size.height === 'number' ? component.size.height : undefined}
            onChange={handleHeightChange}
            value={editable.size.height}
          />
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
