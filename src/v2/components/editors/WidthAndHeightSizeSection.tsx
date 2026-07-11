import { Input } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'

import type { RootPanelSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { isDefined } from '../../utils/isDefined'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'

type WidthAndHeightSizeSectionProps = {
  component: EditableSchema<RootPanelSchema>
  issues: ValidationIssuesSchema<RootPanelSchema['size']>
  onChange: (updated: EditableSchema<RootPanelSchema>) => void
}

export const WidthAndHeightSizeSection: FC<WidthAndHeightSizeSectionProps> = ({ component, issues, onChange }) => {
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
          <Input
            inputMode="decimal"
            aria-invalid={isDefined(issues.width) && issues.width.severity === 'error'}
            onChange={(event) => handleWidthChange(event.currentTarget.value)}
            type="text"
            value={component.size.width}
          />
        </EditorFieldRow>

        <EditorFieldRow label="Magasság">
          <Input
            inputMode="decimal"
            aria-invalid={isDefined(issues.height) && issues.height.severity === 'error'}
            onChange={(event) => handleHeightChange(event.currentTarget.value)}
            type="text"
            value={component.size.height}
          />
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
