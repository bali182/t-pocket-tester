import { SpinButton, type SpinButtonOnChangeData } from '@fluentui/react-components'
import { useCallback, type FC } from 'react'

import { SIZE_STEP } from '../../constants/editor'
import type { RootPanelSchema } from '../../schemas/components'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'
import { getSpinButtonNumberValue } from './getSpinButtonNumberValue'

type WidthAndHeightSizeSectionProps = {
  component: RootPanelSchema
  onChange: (updated: RootPanelSchema) => void
}

const minRootPanelSize = 10

const isValidRootPanelSize = (value: number): boolean => {
  return Number.isFinite(value) && value >= minRootPanelSize
}

export const WidthAndHeightSizeSection: FC<WidthAndHeightSizeSectionProps> = ({ component, onChange }) => {
  const handleWidthChange = useCallback(
    (_event: unknown, data: SpinButtonOnChangeData) => {
      const nextWidth = getSpinButtonNumberValue(data)

      if (nextWidth === undefined || !isValidRootPanelSize(nextWidth)) {
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
      const nextHeight = getSpinButtonNumberValue(data)

      if (nextHeight === undefined || !isValidRootPanelSize(nextHeight)) {
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
        <EditorFieldRow label="Szélesség">
          <SpinButton
            min={minRootPanelSize}
            onChange={handleWidthChange}
            size="small"
            step={SIZE_STEP}
            value={component.size.width}
          />
        </EditorFieldRow>

        <EditorFieldRow label="Magasság">
          <SpinButton
            min={minRootPanelSize}
            onChange={handleHeightChange}
            size="small"
            step={SIZE_STEP}
            value={component.size.height}
          />
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
