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
  issues: ValidationIssuesSchema<EditableSchema<T>>
  onChange: (updated: EditableSchema<T>) => void
}

export function LayoutSection<T extends HasLayoutSchema>({
  editable,
  issues,
  onChange,
}: LayoutSectionProps<T>): ReactNode {
  const handleOrientationChange = useCallback(
    (details: SegmentGroup.ValueChangeDetails) => {
      onChange({ ...editable, layoutOrientation: details.value })
    },
    [editable, onChange],
  )

  const handleOrderChange = useCallback(
    (details: SegmentGroup.ValueChangeDetails) => {
      onChange({ ...editable, layoutOrder: details.value })
    },
    [editable, onChange],
  )

  const handleGapChange = useCallback(
    (layoutGap: string) => {
      onChange({ ...editable, layoutGap })
    },
    [editable, onChange],
  )

  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="Elrendezés">
          <SegmentGroup.Root onValueChange={handleOrientationChange} size="sm" value={editable.layoutOrientation}>
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
          <SegmentGroup.Root onValueChange={handleOrderChange} size="sm" value={editable.layoutOrder}>
            <SegmentGroup.Indicator />
            <SegmentGroup.Item aria-label="Alapértelmezett" value="default">
              <SegmentGroup.ItemHiddenInput />
              {editable.layoutOrientation === 'horizontal' ? <PiArrowRight /> : <PiArrowDown />}
            </SegmentGroup.Item>
            <SegmentGroup.Item aria-label="Fordított" value="reverse">
              <SegmentGroup.ItemHiddenInput />
              {editable.layoutOrientation === 'horizontal' ? <PiArrowLeft /> : <PiArrowUp />}
            </SegmentGroup.Item>
          </SegmentGroup.Root>
        </EditorFieldRow>

        <EditorFieldRow label="Térköz">
          <NumberInput
            issue={issues.layoutGap}
            onChange={handleGapChange}
            step={1}
            unit="mm"
            value={editable.layoutGap}
          />
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
