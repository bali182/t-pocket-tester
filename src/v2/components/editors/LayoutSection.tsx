import { SegmentGroup } from '@chakra-ui/react'
import { useCallback, type ReactNode } from 'react'
import { PiArrowDown, PiArrowLeft, PiArrowRight, PiArrowUp, PiColumns, PiRows } from 'react-icons/pi'

import type { HasLayoutSchema } from '../../schemas/components'
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
    (details: SegmentGroup.ValueChangeDetails) => {
      if (details.value !== 'horizontal' && details.value !== 'vertical') {
        return
      }

      onChange({
        ...editable,
        layout: {
          ...editable.layout,
          orientation: details.value,
        },
      })
    },
    [editable, onChange],
  )

  const handleOrderChange = useCallback(
    (details: SegmentGroup.ValueChangeDetails) => {
      if (details.value !== 'default' && details.value !== 'reverse') {
        return
      }

      onChange({
        ...editable,
        layout: {
          ...editable.layout,
          order: details.value,
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
          <SegmentGroup.Root onValueChange={handleOrientationChange} size="sm" value={editable.layout.orientation}>
            <SegmentGroup.Indicator />
            <SegmentGroup.Item aria-label="Vízszintes" value="horizontal">
              <SegmentGroup.ItemHiddenInput />
              <PiColumns />
            </SegmentGroup.Item>
            <SegmentGroup.Item aria-label="Függőleges" value="vertical">
              <SegmentGroup.ItemHiddenInput />
              <PiRows />
            </SegmentGroup.Item>
          </SegmentGroup.Root>
        </EditorFieldRow>

        <EditorFieldRow label="Irány">
          <SegmentGroup.Root onValueChange={handleOrderChange} size="sm" value={editable.layout.order}>
            <SegmentGroup.Indicator />
            <SegmentGroup.Item aria-label="Alapértelmezett" value="default">
              <SegmentGroup.ItemHiddenInput />
              {editable.layout.orientation === 'horizontal' ? <PiArrowRight /> : <PiArrowDown />}
            </SegmentGroup.Item>
            <SegmentGroup.Item aria-label="Fordított" value="reverse">
              <SegmentGroup.ItemHiddenInput />
              {editable.layout.orientation === 'horizontal' ? <PiArrowLeft /> : <PiArrowUp />}
            </SegmentGroup.Item>
          </SegmentGroup.Root>
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
