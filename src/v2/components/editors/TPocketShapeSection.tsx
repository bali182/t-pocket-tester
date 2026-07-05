import { SpinButton, type SpinButtonOnChangeData } from '@fluentui/react-components'
import { useCallback, type FC } from 'react'

import { SIZE_STEP } from '../../constants/editor'
import type { PocketClusterSchema } from '../../schemas/components'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'
import { getSpinButtonNumberValue } from './getSpinButtonNumberValue'

type TPocketShapeSectionProps = {
  component: PocketClusterSchema
  onChange: (updated: PocketClusterSchema) => void
}

const minSize = 0

const isValidSize = (value: number): boolean => {
  return Number.isFinite(value) && value >= minSize
}

export const TPocketShapeSection: FC<TPocketShapeSectionProps> = ({ component, onChange }) => {
  const handleTPocketTabWidthChange = useCallback(
    (_event: unknown, data: SpinButtonOnChangeData) => {
      const tPocketTabWidth = getSpinButtonNumberValue(data)

      if (tPocketTabWidth === undefined || !isValidSize(tPocketTabWidth)) {
        return
      }

      onChange({
        ...component,
        tPocketTabWidth,
      })
    },
    [component, onChange],
  )

  const handleTPocketTaperChange = useCallback(
    (_event: unknown, data: SpinButtonOnChangeData) => {
      const tPocketTaper = getSpinButtonNumberValue(data)

      if (tPocketTaper === undefined || !isValidSize(tPocketTaper)) {
        return
      }

      onChange({
        ...component,
        tPocketTaper,
      })
    },
    [component, onChange],
  )

  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="T-fül szélessége">
          <SpinButton
            min={minSize}
            onChange={handleTPocketTabWidthChange}
            size="small"
            step={SIZE_STEP}
            value={component.tPocketTabWidth}
          />
        </EditorFieldRow>

        <EditorFieldRow label="T-zseb szűkülése">
          <SpinButton
            min={minSize}
            onChange={handleTPocketTaperChange}
            size="small"
            step={SIZE_STEP}
            value={component.tPocketTaper}
          />
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
