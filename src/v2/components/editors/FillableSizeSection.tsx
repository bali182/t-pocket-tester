import { useCallback } from 'react'

import type { HasFillableSizeSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { FillableSizeSchema } from '../../schemas/geometry'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'
import { FillableSizeInput } from './FillableSizeInput'

type FillableSizeSectionProps<T> = {
  component: T
  issues: ValidationIssuesSchema<FillableSizeSchema>
  onChange: (updated: T) => void
}

export function FillableSizeSection<T extends EditableSchema<HasFillableSizeSchema>>({
  component,
  issues,
  onChange,
}: FillableSizeSectionProps<T>) {
  const handleWidthChange = useCallback(
    (width: string) => {
      onChange({
        ...component,
        size: {
          ...component.size,
          width,
        },
      })
    },
    [component, onChange],
  )

  const handleHeightChange = useCallback(
    (height: string) => {
      onChange({
        ...component,
        size: {
          ...component.size,
          height,
        },
      })
    },
    [component, onChange],
  )

  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="Szélesség">
          <FillableSizeInput issue={issues.width} onChange={handleWidthChange} value={component.size.width} />
        </EditorFieldRow>

        <EditorFieldRow label="Magasság">
          <FillableSizeInput issue={issues.height} onChange={handleHeightChange} value={component.size.height} />
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
