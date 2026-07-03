import {
  SpinButton,
  Toolbar,
  ToolbarRadioButton,
  ToolbarRadioGroup,
  type SpinButtonOnChangeData,
  type ToolbarProps,
} from '@fluentui/react-components'
import { useCallback, type ReactNode } from 'react'
import { PiColumns, PiRows } from 'react-icons/pi'

import type { LayoutedComponentSchema, LayoutOrientation } from '../../schemas/components'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'

type LayoutSectionProps<T> = {
  component: T
  onChange: (updated: T) => void
}

const minGap = 0
const gapStep = 0.1

const isValidGap = (value: number): boolean => {
  return Number.isFinite(value) && value >= minGap
}

export function LayoutSection<T extends LayoutedComponentSchema>({
  component,
  onChange,
}: LayoutSectionProps<T>): ReactNode {
  const handleOrientationChange = useCallback(
    (_event: unknown, data: Parameters<NonNullable<ToolbarProps['onCheckedValueChange']>>[1]) => {
      const orientation = data.checkedItems[0] as LayoutOrientation
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

  const handleGapChange = useCallback(
    (_event: unknown, data: SpinButtonOnChangeData) => {
      const nextGap = data.value

      if (typeof nextGap !== 'number' || !isValidGap(nextGap)) {
        return
      }
      onChange({
        ...component,
        layout: {
          ...component.layout,
          gap: nextGap,
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

        <EditorFieldRow label="Térköz">
          <SpinButton
            min={minGap}
            onChange={handleGapChange}
            size="small"
            step={gapStep}
            value={component.layout.gap}
          />
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
