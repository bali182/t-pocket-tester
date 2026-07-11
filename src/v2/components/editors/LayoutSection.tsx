import { Input } from '@chakra-ui/react'
import { Toolbar, ToolbarRadioButton, ToolbarRadioGroup, type ToolbarProps } from '@fluentui/react-components'
import { useCallback, type ReactNode } from 'react'
import { PiArrowDown, PiArrowLeft, PiArrowRight, PiArrowUp, PiColumns, PiRows } from 'react-icons/pi'

import type { HasLayoutSchema, LayoutOrderSchema, LayoutOrientationSchema } from '../../schemas/components'
import type { EditableSchema } from '../../schemas/editable'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { isDefined } from '../../utils/isDefined'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'

type LayoutSectionProps<T> = {
  component: T
  issues: ValidationIssuesSchema<HasLayoutSchema['layout']>
  onChange: (updated: T) => void
}

export function LayoutSection<T extends EditableSchema<HasLayoutSchema>>({
  component,
  issues,
  onChange,
}: LayoutSectionProps<T>): ReactNode {
  const handleOrientationChange = useCallback(
    (_event: unknown, data: Parameters<NonNullable<ToolbarProps['onCheckedValueChange']>>[1]) => {
      const orientation = data.checkedItems[0] as LayoutOrientationSchema
      onChange({
        ...component,
        layout: {
          ...component.layout,
          orientation,
        },
      })
    },
    [component, onChange],
  )

  const handleOrderChange = useCallback(
    (_event: unknown, data: Parameters<NonNullable<ToolbarProps['onCheckedValueChange']>>[1]) => {
      const order = data.checkedItems[0] as LayoutOrderSchema
      onChange({
        ...component,
        layout: {
          ...component.layout,
          order,
        },
      })
    },
    [component, onChange],
  )

  const handleGapChange = useCallback(
    (gap: string) => {
      onChange({
        ...component,
        layout: {
          ...component.layout,
          gap,
        },
      })
    },
    [component, onChange],
  )

  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="Elrendezés">
          <Toolbar
            checkedValues={{ orientation: [component.layout.orientation] }}
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
            checkedValues={{ order: [component.layout.order] }}
            onCheckedValueChange={handleOrderChange}
            size="small"
          >
            <ToolbarRadioGroup>
              <ToolbarRadioButton
                aria-label="Alapértelmezett"
                icon={component.layout.orientation === 'horizontal' ? <PiArrowRight /> : <PiArrowDown />}
                name="order"
                value="default"
              />
              <ToolbarRadioButton
                aria-label="Fordított"
                icon={component.layout.orientation === 'horizontal' ? <PiArrowLeft /> : <PiArrowUp />}
                name="order"
                value="reverse"
              />
            </ToolbarRadioGroup>
          </Toolbar>
        </EditorFieldRow>

        <EditorFieldRow label="Térköz">
          <Input
            inputMode="decimal"
            aria-invalid={isDefined(issues.gap) && issues.gap.severity === 'error'}
            onChange={(event) => handleGapChange(event.currentTarget.value)}
            type="text"
            value={component.layout.gap}
          />
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
