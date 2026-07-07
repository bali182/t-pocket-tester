import {
  SpinButton,
  Toolbar,
  ToolbarRadioButton,
  ToolbarRadioGroup,
  type SpinButtonOnChangeData,
  type ToolbarProps,
} from '@fluentui/react-components'
import { useCallback, type ReactNode } from 'react'
import { PiArrowDown, PiArrowLeft, PiArrowRight, PiArrowUp, PiColumns, PiRows } from 'react-icons/pi'

import { SIZE_STEP } from '../../constants/editor'
import type { HasLayoutSchema, LayoutOrder, LayoutOrientation } from '../../schemas/components'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'
import { getSpinButtonNumberValue } from './getSpinButtonNumberValue'

type LayoutSectionProps<T> = {
  component: T
  onChange: (updated: T) => void
}

const minGap = 0

const isValidGap = (value: number): boolean => {
  return Number.isFinite(value) && value >= minGap
}

export function LayoutSection<T extends HasLayoutSchema>({
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

  const handleOrderChange = useCallback(
    (_event: unknown, data: Parameters<NonNullable<ToolbarProps['onCheckedValueChange']>>[1]) => {
      const order = data.checkedItems[0] as LayoutOrder
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
    (_event: unknown, data: SpinButtonOnChangeData) => {
      const nextGap = getSpinButtonNumberValue(data)

      if (nextGap === undefined || !isValidGap(nextGap)) {
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
          <SpinButton
            min={minGap}
            onChange={handleGapChange}
            size="small"
            step={SIZE_STEP}
            value={component.layout.gap}
          />
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
