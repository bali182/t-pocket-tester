import { SpinButton, type SpinButtonOnChangeData } from '@fluentui/react-components'
import { useCallback, type FC } from 'react'

import type { RootPanelSchema } from '../../schemas/components'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'

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
    (_event: unknown, data: SpinButtonOnChangeData) => {
      const nextWidth = data.value

      if (typeof nextWidth !== 'number' || !isValidRootPanelSize(nextWidth)) {
        return
      }

      onChange({
        ...component,
        size: {
          ...component.size,
          width: nextWidth,
        },
      })
    },
    [component, onChange],
  )

  const handleHeightChange = useCallback(
    (_event: unknown, data: SpinButtonOnChangeData) => {
      const nextHeight = data.value

      if (typeof nextHeight !== 'number' || !isValidRootPanelSize(nextHeight)) {
        return
      }

      onChange({
        ...component,
        size: {
          ...component.size,
          height: nextHeight,
        },
      })
    },
    [component, onChange],
  )

  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="Width">
          <SpinButton
            min={minRootPanelSize}
            onChange={handleWidthChange}
            size="small"
            step={rootPanelSizeStep}
            value={component.size.width}
          />
        </EditorFieldRow>

        <EditorFieldRow label="Height">
          <SpinButton
            min={minRootPanelSize}
            onChange={handleHeightChange}
            size="small"
            step={rootPanelSizeStep}
            value={component.size.height}
          />
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
