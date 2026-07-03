import { useCallback, type FC } from 'react'

import type { PanelSchema } from '../../schemas/components'
import type { FillableSize } from '../../schemas/geometry'
import { isDefined } from '../../utils/isDefined'
import { EditorFieldGrid } from './EditorFieldGrid'
import { EditorFieldRow } from './EditorFieldRow'
import { EditorSection } from './EditorSection'
import { FillableSizeInput } from './FillableSizeInput'

type PanelSizeSectionProps = {
  component: PanelSchema
  onChange: (updated: PanelSchema) => void
}

type FillableSizeValue = FillableSize['width']

const getNormalizedPanelSize = (size: PanelSchema['size']): FillableSize => {
  return {
    width: isDefined(size?.width) ? size.width : 'fill',
    height: isDefined(size?.height) ? size.height : 'fill',
  }
}

export const PanelSizeSection: FC<PanelSizeSectionProps> = ({ component, onChange }) => {
  const size = getNormalizedPanelSize(component.size)

  const handleWidthChange = useCallback(
    (width: FillableSizeValue) => {
      onChange({
        ...component,
        size: {
          ...getNormalizedPanelSize(component.size),
          width,
        },
      })
    },
    [component, onChange],
  )

  const handleHeightChange = useCallback(
    (height: FillableSizeValue) => {
      onChange({
        ...component,
        size: {
          ...getNormalizedPanelSize(component.size),
          height,
        },
      })
    },
    [component, onChange],
  )

  return (
    <EditorSection>
      <EditorFieldGrid>
        <EditorFieldRow label="Szélesség">
          <FillableSizeInput onChange={handleWidthChange} value={size.width} />
        </EditorFieldRow>

        <EditorFieldRow label="Magasság">
          <FillableSizeInput onChange={handleHeightChange} value={size.height} />
        </EditorFieldRow>
      </EditorFieldGrid>
    </EditorSection>
  )
}
