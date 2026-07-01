import { Card, NumberInput, SegmentGroup, type NumberInputValueChangeDetails } from '@chakra-ui/react'
import { useCallback, type ReactNode } from 'react'
import { PiColumns, PiRows } from 'react-icons/pi'

import type { LayoutedComponentSchema, LayoutOrientation } from '../../schemas/components'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'

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
    (details: SegmentGroup.ValueChangeDetails) => {
      const orientation = details.value as LayoutOrientation
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
    (details: NumberInputValueChangeDetails) => {
      if (!isValidGap(details.valueAsNumber)) {
        return
      }
      onChange({
        ...component,
        layout: {
          ...component.layout,
          gap: details.valueAsNumber,
        },
      })
    },
    [component, onChange],
  )

  return (
    <Card.Body borderTopWidth="1px" gap="2" paddingBlock="3" paddingInline="3">
      <EditorFieldGrid>
        <EditorFieldRow label="Elrendezés">
          <SegmentGroup.Root
            justifySelf="end"
            onValueChange={handleOrientationChange}
            value={component.layout.orientation}
            width="fit-content"
          >
            <SegmentGroup.Indicator />
            <SegmentGroup.Items
              items={[
                { value: 'horizontal', label: <PiColumns /> },
                { value: 'vertical', label: <PiRows /> },
              ]}
            />
          </SegmentGroup.Root>
        </EditorFieldRow>

        <EditorFieldRow label="Térköz">
          <NumberInput.Root
            allowOverflow={false}
            clampValueOnBlur
            min={minGap}
            onValueChange={handleGapChange}
            step={gapStep}
            value={String(component.layout.gap)}
          >
            <NumberInput.Input />
          </NumberInput.Root>
        </EditorFieldRow>
      </EditorFieldGrid>
    </Card.Body>
  )
}
