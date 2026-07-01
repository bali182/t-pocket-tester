import { Card, NumberInput, type NumberInputValueChangeDetails } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'

import type { RootPanelSchema } from '../../schemas/components'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'

type WidthAndHeightSizeSectionProps = {
  component: RootPanelSchema
  onChange: (updated: RootPanelSchema) => void
}

const minRootPanelSize = 10
const rootPanelSizeStep = 0.1

const isValidRootPanelSize = (value: number): boolean => {
  return Number.isFinite(value) && value >= minRootPanelSize
}

export const WidthAndHeightSizeSection: FC<WidthAndHeightSizeSectionProps> = ({ component, onChange }) => {
  const handleWidthChange = useCallback(
    (details: NumberInputValueChangeDetails) => {
      if (!isValidRootPanelSize(details.valueAsNumber)) {
        return
      }

      onChange({
        ...component,
        size: {
          ...component.size,
          width: details.valueAsNumber,
        },
      })
    },
    [component, onChange],
  )

  const handleHeightChange = useCallback(
    (details: NumberInputValueChangeDetails) => {
      if (!isValidRootPanelSize(details.valueAsNumber)) {
        return
      }

      onChange({
        ...component,
        size: {
          ...component.size,
          height: details.valueAsNumber,
        },
      })
    },
    [component, onChange],
  )

  return (
    <Card.Body borderTopWidth="1px" gap="2" paddingBlock="3" paddingInline="3">
      <EditorFieldGrid>
        <EditorFieldRow label="Width">
          <NumberInput.Root
            allowOverflow={false}
            clampValueOnBlur
            min={minRootPanelSize}
            onValueChange={handleWidthChange}
            step={rootPanelSizeStep}
            value={String(component.size.width)}
          >
            <NumberInput.Input />
          </NumberInput.Root>
        </EditorFieldRow>

        <EditorFieldRow label="Height">
          <NumberInput.Root
            allowOverflow={false}
            clampValueOnBlur
            min={minRootPanelSize}
            onValueChange={handleHeightChange}
            step={rootPanelSizeStep}
            value={String(component.size.height)}
          >
            <NumberInput.Input />
          </NumberInput.Root>
        </EditorFieldRow>
      </EditorFieldGrid>
    </Card.Body>
  )
}
