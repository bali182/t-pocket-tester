import { Toolbar, ToolbarRadioButton, ToolbarRadioGroup, type ToolbarProps } from '@fluentui/react-components'
import { useCallback, type ReactNode } from 'react'
import { PiArrowDown, PiArrowLeft, PiArrowRight, PiArrowUp, PiColumns, PiRows } from 'react-icons/pi'

import type { HasLayoutSchema, LayoutOrderSchema, LayoutOrientationSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'
import { NumberInput } from './NumberInput'

type LayoutSectionProps<T extends HasLayoutSchema> = {
  component: T
  editable: EditableSchema<T>
  issues: ValidationIssuesSchema<HasLayoutSchema['layout']>
  onChange: (updated: EditableSchema<T>) => void
}

export function LayoutSection<T extends HasLayoutSchema>({
  editable,
  issues,
  onChange,
}: LayoutSectionProps<T>): ReactNode {
  const handleOrientationChange = useCallback(
    (_event: unknown, data: Parameters<NonNullable<ToolbarProps['onCheckedValueChange']>>[1]) => {
      const orientation = data.checkedItems[0] as LayoutOrientationSchema
      onChange({
        ...editable,
        layout: {
          ...editable.layout,
          orientation,
        },
      })
    },
    [editable, onChange],
  )

  const handleOrderChange = useCallback(
    (_event: unknown, data: Parameters<NonNullable<ToolbarProps['onCheckedValueChange']>>[1]) => {
      const order = data.checkedItems[0] as LayoutOrderSchema
      onChange({
        ...editable,
        layout: {
          ...editable.layout,
          order,
        },
      })
    },
    [editable, onChange],
  )

  const handleGapChange = useCallback(
    (gap: string) => {
      onChange({
        ...editable,
        layout: {
          ...editable.layout,
          gap,
        },
      })
    },
    [editable, onChange],
  )

  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="Elrendezés">
          <Toolbar
            checkedValues={{ orientation: [editable.layout.orientation] }}
            onCheckedValueChange={handleOrientationChange}
            size="small"
          >
            <ToolbarRadioGroup>
              <ToolbarRadioButton aria-label="Vízszintes" icon={<PiColumns />} name="orientation" value="horizontal" />
              <ToolbarRadioButton aria-label="Függőleges" icon={<PiRows />} name="orientation" value="vertical" />
            </ToolbarRadioGroup>
          </Toolbar>
        </EditorFieldRow>

        <EditorFieldRow label="Irány">
          <Toolbar
            checkedValues={{ order: [editable.layout.order] }}
            onCheckedValueChange={handleOrderChange}
            size="small"
          >
            <ToolbarRadioGroup>
              <ToolbarRadioButton
                aria-label="Alapértelmezett"
                icon={editable.layout.orientation === 'horizontal' ? <PiArrowRight /> : <PiArrowDown />}
                name="order"
                value="default"
              />
              <ToolbarRadioButton
                aria-label="Fordított"
                icon={editable.layout.orientation === 'horizontal' ? <PiArrowLeft /> : <PiArrowUp />}
                name="order"
                value="reverse"
              />
            </ToolbarRadioGroup>
          </Toolbar>
        </EditorFieldRow>

        <EditorFieldRow label="Térköz">
          <NumberInput
            issue={issues.gap}
            onChange={handleGapChange}
            step={1}
            unit="mm"
            value={editable.layout.gap}
          />
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
